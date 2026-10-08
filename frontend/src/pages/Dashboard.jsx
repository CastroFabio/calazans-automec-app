import { useEffect, useState } from "react";
import { orderApi } from "../api/orders";
import { useCustomers } from "../context/Customer.context";
import Loading from "./Loading";
import { formattedPrice } from "../utils/convertPrice";
import { statusReverseMapBadge } from "../utils/statusMap";

export default function Dashboard() {
  const { loading, setLoading } = useCustomers();

  const [dataMetrics, setDataMetrics] = useState();

  const handleGetMetricsDashboard = async () => {
    setLoading(true);
    const { data } = await orderApi.getMetricsDashboard();

    setDataMetrics(data);
    setLoading(false);
  };

  const {
    monthlyRevenue,
    currentRevenue,
    previousRevenue,
    averageTicket,
    totalCompletedOrders,
    openServiceOrdersCount,
    completedServiceOrdersCount,
    awaitingPaymentServiceOrdersCount,
    inProgressServiceOrdersCount,
    totalPendingAmount,
    statusBreakdown,
    topServices,
    totalTop6JobsCount,
    revenueLast6Months,
    sixMonthRevenue,
    totalOrdersCount,
  } = dataMetrics ? dataMetrics : {};

  let revenueDeltaPercentage = 0;

  if (previousRevenue > 0) {
    revenueDeltaPercentage =
      ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  } else if (currentRevenue > 0) {
    revenueDeltaPercentage = 100;
  }
  revenueDeltaPercentage = Number(revenueDeltaPercentage.toFixed(2));

  const isPositiveDelta = revenueDeltaPercentage >= 0;

  useEffect(() => {
    handleGetMetricsDashboard();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="page-dashboard">
      {/* Métricas e Indicadores */}
      <div className="home-metrics">
        {/* Linha 1: KPIs Principais */}
        <div className="metrics-row">
          <div className="metric-card green">
            <div className="metric-label">Faturamento este mês</div>
            <div className="metric-value" id="mFatMes">
              {`${formattedPrice(monthlyRevenue)}`}
            </div>
            <div className="metric-sub" id="mFatMesSub">
              <strong></strong>
              {`${completedServiceOrdersCount} OS concluídas este mês`}
            </div>
            {revenueDeltaPercentage !== null && (
              <div
                className={`metric-delta ${isPositiveDelta ? "up" : "down"}`}
                id="mFatDelta"
              >
                {isPositiveDelta ? "▲ " : "▼ "}
                {Math.abs(revenueDeltaPercentage)}% vs mês anterior
              </div>
            )}
          </div>

          <div className="metric-card blue">
            <div className="metric-label">Ticket médio / OS</div>
            <div className="metric-value" id="mTicket">
              {formattedPrice(averageTicket)}
            </div>
            <div className="metric-sub" id="mTicketSub">
              {`sobre ${completedServiceOrdersCount} OS concluídas`}
            </div>
          </div>

          <div className="metric-card orange">
            <div className="metric-label">OS em aberto</div>
            <div className="metric-value" id="mOsAberto">
              {`${openServiceOrdersCount}`}
            </div>
            <div className="metric-sub" id="mOsAbertoSub">
              {`${inProgressServiceOrdersCount} em andamento`}
            </div>
          </div>

          <div className="metric-card yellow">
            <div className="metric-label">A receber</div>
            <div className="metric-value" id="mAReceber">
              {formattedPrice(totalPendingAmount)}
            </div>
            <div className="metric-sub" id="mAReceberSub">
              {`${awaitingPaymentServiceOrdersCount} OS aguardando receber`}
            </div>
          </div>
        </div>

        {/* Linha 2: Status Geral e Serviços Frequentes */}
        <div className="metrics-status-row">
          <div className="metric-donut-card">
            <div className="metric-header-flex">
              <div className="metric-label ">Status geral das OS</div>
              <div className="metric-sub" id="mStatusTotal">
                {`${totalOrdersCount} OS total`}
              </div>
            </div>
            <div className="donut-bars" id="mStatusBars">
              {dataMetrics && statusBreakdown.length > 0
                ? statusBreakdown.map((element, index) => {
                    return (
                      <div className="donut-bar-row" key={index}>
                        <span className="donut-bar-label">
                          {element.statusName}
                        </span>
                        <div className="donut-bar-track">
                          <div className="donut-bar-fill">
                            <div
                              className={`donut-bar-fill donut-bar-fill-${statusReverseMapBadge[element.statusId]}`}
                              style={{
                                width: `${(element.count / totalOrdersCount) * 100}%`,
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
              {dataMetrics && topServices.length > 0
                ? topServices.map((element, index) => (
                    <div className="donut-bar-row" key={index + 1}>
                      <span
                        className="donut-bar-label"
                        title={`${element.name}`}
                      >
                        {element.name}
                      </span>
                      <div className="donut-bar-track">
                        <div
                          className={`donut-bar-fill donut-bar-fill-${index + 1}`}
                          style={{
                            width: `${Math.round(
                              (element.count / totalTop6JobsCount) * 100,
                            )}%`,
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
        {/* <div className="metric-donut-card sparkline-card">
          <div className="metric-header-flex" style={{ marginBottom: "12px" }}>
            <div className="metric-label">Faturamento — últimos 6 meses</div>
            <div
              className="metric-sub"
              id="mSparkTotal"
            >{`${formattedPrice(100)} em 6 meses`}</div>
          </div>
          <div id="mSparkline" className="sparkline-container">
            <div className="sparkline-container-info">
              <span className={`sparkline-container-info-value`}>{100}</span>
              <div
                title="${tip}"
                className="sparkline-container-info-label"
                style={{ height: `${12}px`, background: `green` }}
              ></div>
            </div>
          </div>
          <div id="mSparkLabels" className="sparkline-labels">
            <div
              className="sparkline-labels-value"
              style={{
                fontWeight: `${5 === 5 ? "700" : "400"}`,
                color: `${5 === 5 ? "var(--ink)" : "var(--ink3)"}`,
              }}
            >
              lable
            </div>
          </div>
          <div id="mSparkLabels" className="sparkline-labels">
            <div
              className="sparkline-labels-value"
              style={{
                fontWeight: `${5 === 5 ? "700" : "400"}`,
                color: `${5 === 5 ? "var(--ink)" : "var(--ink3)"}`,
              }}
            >
              lable
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
