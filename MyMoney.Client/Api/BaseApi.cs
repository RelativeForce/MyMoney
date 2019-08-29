﻿using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using MyMoney.Client.Interfaces;
using Newtonsoft.Json;

namespace MyMoney.Client.Api
{
    public abstract class BaseApi
    {
        private readonly HttpClient _client;
        protected readonly IAuthenticationManager Manager;

        protected BaseApi(HttpClient client, IAuthenticationManager manager)
        {
            _client = client;
            Manager = manager;
        }

        protected async Task<T> SendPost<T>(string endPoint, object payload)
        {
            return await Send<T>(HttpMethod.Post, endPoint, payload);
        }

        protected void EnsureAuthenticated()
        {
            if(!Manager.IsAuthenticated)
                throw new InvalidOperationException("User must be logged in first");
        }

        protected async Task<T> SendGet<T>(string endPoint, object payload)
        {
            return await Send<T>(HttpMethod.Get, endPoint, payload);
        }

        private async Task<T> Send<T>(HttpMethod method, string endPoint, object payload)
        {
            var content = Serialize(payload);

            var request = BuildRequest(method, endPoint, content);

            using (var result = await _client.SendAsync(request))
            {
                return await Deserialize<T>(result);
            }
        }

        private HttpRequestMessage BuildRequest(HttpMethod method, string endPoint, StringContent content)
        {
            var request = new HttpRequestMessage
            {
                Method = method,
                RequestUri = new Uri($"{ApiConstants.Url}{endPoint}"),
                Content = content,
            };

            if (Manager.IsAuthenticated)
            {
                request.Headers.Add("Authorization", $"Bearer {Manager.Token}");
            }

            return request;
        }

        private static StringContent Serialize(object obj)
        {
            return new StringContent(JsonConvert.SerializeObject(obj), Encoding.UTF8, "application/json");
        }

        private static async Task<T> Deserialize<T>(HttpResponseMessage result)
        {
            var responseString = await result.Content.ReadAsStringAsync();

            if (result.StatusCode != HttpStatusCode.OK)
                throw new Exception(responseString);

            return JsonConvert.DeserializeObject<T>(responseString);
        }
    }
}
