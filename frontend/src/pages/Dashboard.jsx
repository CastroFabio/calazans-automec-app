import { useEffect, useState } from "react";
import { orderApi } from "../api/orders";
import { useCustomers } from "../context/Customer.context";
import Loading from "./Loading";
import { formattedPrice } from "../utils/convertPrice";

export default function Dashboard({ metricsData }) {
  const {
    faturamentoMes = "—",
    ticketMedio = "—",
    osEmAberto = "—",
    aReceber = "—",
    fatMesSub = "",
    ticketSub = "",
    osAbertoSub = "",
    aReceberSub = "",
    greetingTitle = "MecânicaOS",
    greetingSub = "Carregando métricas…",
  } = metricsData || {};

  const { loading, setLoading } = useCustomers();

  const [dataMetrics, setDataMetrics] = useState();

  const handleGetMetricsDashboard = async () => {
    setLoading(true);
    const { data } = await orderApi.getMetricsDashboard();
    console.log(data);

    setDataMetrics(data);
    setLoading(false);
  };

  const delta = null;

  useEffect(() => {
    handleGetMetricsDashboard();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="home-page">
      {/* Cabeçalho / Saudação */}
      <div className="home-greeting">
        <div
          className="home-greeting-title"
          id="homeGreetingTitle"
          dangerouslySetInnerHTML={{ __html: greetingTitle }}
        />
        <div className="home-greeting-sub" id="homeGreetingSub">
          {`${dataMetrics?.openServiceOrdersCount} OS em aberto · ${dataMetrics?.awaitingPaymentServiceOrdersCount} aguardando pagamento`}
        </div>
      </div>

      {/* Métricas e Indicadores */}
      <div className="home-metrics">
        {/* Linha 1: KPIs Principais */}
        <div className="metrics-row">
          <div className="metric-card green">
            <div className="metric-label">Faturamento este mês</div>
            <div className="metric-value" id="mFatMes">
              {`${formattedPrice(dataMetrics?.monthlyRevenue)}`}
            </div>
            <div className="metric-sub" id="mFatMesSub">
              <strong></strong>
              {`${dataMetrics?.completedServiceOrdersCount} orden(s) de serviço este mês`}
            </div>
            {delta !== null && (
              <div
                className={`metric-delta ${delta >= 0 ? "up" : "down"}`}
                id="mFatDelta"
              >
                {delta >= 0 ? "▲ " : "▼ "}
                {Math.abs(delta)}% vs mês anterior
              </div>
            )}
          </div>

          <div className="metric-card blue">
            <div className="metric-label">Ticket médio / OS</div>
            <div className="metric-value" id="mTicket">
              {formattedPrice(dataMetrics?.averageTicket)}
            </div>
            <div className="metric-sub" id="mTicketSub">
              {`sobre ${dataMetrics?.completedServiceOrdersCount} OS concluídas`}
            </div>
          </div>

          <div className="metric-card orange">
            <div className="metric-label">OS em aberto</div>
            <div className="metric-value" id="mOsAberto">
              {`${dataMetrics?.openServiceOrdersCount}`}
            </div>
            <div className="metric-sub" id="mOsAbertoSub">
              {`${dataMetrics?.awaitingPaymentServiceOrdersCount} em andamento`}
            </div>
          </div>

          <div className="metric-card yellow">
            <div className="metric-label">A receber</div>
            <div className="metric-value" id="mAReceber">
              {formattedPrice(dataMetrics?.totalPendingAmount)}
            </div>
            <div className="metric-sub" id="mAReceberSub">
              {`${dataMetrics?.awaitingPaymentServiceOrdersCount} OS aguardando`}
            </div>
          </div>
        </div>

        {/* Linha 2: Status Geral e Serviços Frequentes */}
        <div className="metrics-status-row">
          <div className="metric-donut-card">
            <div className="metric-header-flex">
              <div className="metric-label ">Status geral das OS</div>
              <div className="metric-sub" id="mStatusTotal">
                {`${dataMetrics?.totalOrdersCount} OS total`}
              </div>
            </div>
            <div className="donut-bars" id="mStatusBars">
              {dataMetrics && dataMetrics?.statusBreakdown.length > 0
                ? dataMetrics.statusBreakdown.map((element, index) => {
                    return (
                      <div className="donut-bar-row" key={index}>
                        <span className="donut-bar-label">
                          {element.statusName}
                        </span>
                        <div className="donut-bar-track">
                          <div className="donut-bar-fill">
                            <div
                              className="donut-bar-fill"
                              style={{
                                width: `${(element.count / dataMetrics?.totalOrdersCount) * 100}%`,
                                background: "rgb(34, 197, 94)",
                              }}
                            ></div>
                          </div>
                        </div>
                        <span className="donut-bar-val">{element.count}</span>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>

          <div className="metric-donut-card">
            <div className="metric-label">Serviços mais frequentes</div>
            <div className="donut-bars" id="mSvcBars">
              {dataMetrics && dataMetrics?.topServices.length > 0
                ? dataMetrics?.topServices.map((element, index) => (
                    <div className="donut-bar-row" key={index}>
                      <span
                        className="donut-bar-label"
                        title={`${element.name}`}
                      >
                        {element.name}
                      </span>
                      <div className="donut-bar-track">
                        <div
                          className="donut-bar-fill"
                          style={{
                            width: `${(element.count / dataMetrics?.topServices.length) * 100}%`,
                            background: "rgb(34, 197, 94)",
                          }}
                        ></div>
                      </div>
                      <span className="donut-bar-val">{element.count}×</span>
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>

        {/* Linha 3: Sparkline de Faturamento */}
        <div className="metric-donut-card sparkline-card">
          <div className="metric-header-flex" style={{ marginBottom: "12px" }}>
            <div className="metric-label">Faturamento — últimos 6 meses</div>
            <div className="metric-sub" id="mSparkTotal"></div>
          </div>

          {/*
          <div id="mSparkline" className="sparkline-container">
            <div className="sparkline-container-info">
              <span className={`sparkline-container-info-value`}>
                ${v > 0 ? fmtBRL(v).replace("R$ ", "") : "—"}
              </span>
              <div
                title="${tip}"
                style="width:100%;height:${h}px;background:${barColors[i]};border-radius:3px 3px 0 0;min-height:4px;transition:height .5s;cursor:default;"
              ></div>
            </div>
          </div>
          <div id="mSparkLabels" className="sparkline-labels">
            <div style="flex:1;text-align:center;font-size:10px;font-weight:${i===5?'700':'400'};color:${i===5?'var(--ink)':'var(--ink3)'};">
              ${m.label}
            </div>
          </div>{" "}
          */}
        </div>
      </div>
    </div>
  );
}
