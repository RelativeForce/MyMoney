import { ISeriesItem } from "@mymoney-common/interfaces";
import Chart from "../components/chart";
import { IChartDataProvider } from "../interfaces/chart-data-provider";

export default function Home() {

const provider : IChartDataProvider = {
   chartTitle: "Running total",
   yAxisLabel: "",
   colorScheme: {
      domain: []
   },
   seriesData: [],
   subChartTitle: "",
   onSelect: (data: ISeriesItem) => {},
   init: () => {},
   destroy: () => {},
   next: () => {},
   previous: () => {},
};

   return <Chart dataProvider={provider}></Chart>;
}
