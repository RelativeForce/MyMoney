using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using MyMoney.Client.Interfaces.Api;
using Newtonsoft.Json;

namespace MyMoney.Client.Api
{
    public abstract class BaseApi : IBaseApi
    {
        private readonly HttpClient _client;

        public string Token { get; set; }

        protected BaseApi(HttpClient client)
        {
            _client = client;
        }

        protected async Task<T> SendPost<T>(string endPoint, object payload)
        {
            var content = Serialize(payload);

            var request = BuildRequest(HttpMethod.Post, endPoint, content);

            var result = await _client.SendAsync(request).ConfigureAwait(false);

            return await Deserialize<T>(result);
        }

        protected async Task<T> SendGet<T>(string endPoint, object payload)
        {
            var content = Serialize(payload);

            var request = BuildRequest(HttpMethod.Get, endPoint, content);

            var result = await _client.SendAsync(request).ConfigureAwait(false);

            return await Deserialize<T>(result);
        }

        private HttpRequestMessage BuildRequest(HttpMethod method, string endPoint, StringContent content)
        {
            var request = new HttpRequestMessage
            {
                Method = method,
                RequestUri = new Uri($"{ApiConstants.Url}{endPoint}"),
                Content = content,
            };

            if (Token != null)
            {
                request.Headers.Add("Authorization", $"Bearer {Token}");
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

            return JsonConvert.DeserializeObject<T>(responseString);
        }
    }
}
