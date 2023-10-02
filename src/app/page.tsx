import { Patrimony } from "../components/charts/patrimony";

export default function Home() {
  return (
    <main className="flex h-screen w-screen gap-4 p-4">
      <div className="flex w-1/3 items-center justify-center">
        Profitability in the month
      </div>
      <div className="flex w-2/3 flex-col gap-4">
        <div className="flex h-1/4 items-center justify-center">
          Position
        </div>
        <div className="flex flex-grow items-center justify-center">
          <Patrimony/>
        </div>
      </div>
    </main>
  )
}
