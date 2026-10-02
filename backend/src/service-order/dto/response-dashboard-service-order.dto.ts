import { ApiProperty } from '@nestjs/swagger';

export class StatusBreakdownDto {
  @ApiProperty({ example: 1, description: 'ID do status numérico da OS' })
  statusId!: number | null;

  @ApiProperty({
    example: 'Pendente',
    description: 'Nome descritivo do status',
  })
  statusName!: string;

  @ApiProperty({ example: 8, description: 'Quantidade de OSs neste status' })
  count!: number;
}

export class TopServiceItemDto {
  @ApiProperty({ example: 3, description: 'ID da manutenção/serviço' })
  serviceId!: number | null;

  @ApiProperty({
    example: 'Troca de Óleo e Filtro',
    description: 'Nome do serviço executado',
  })
  name!: string;

  @ApiProperty({ example: 15, description: 'Quantidade de vezes realizado' })
  count!: number;
}

export class RevenueByMonthDto {
  @ApiProperty({
    example: '2026-05',
    description: 'Ano e mês no formato YYYY-MM',
  })
  month!: string;

  @ApiProperty({ example: 14500.5, description: 'Faturamento total do mês' })
  total!: number;
}

export class DashboardMetricsDto {
  @ApiProperty({
    example: 18450.0,
    description: 'Faturamento total das OSs concluídas no mês atual',
  })
  monthlyRevenue!: number;

  @ApiProperty({
    example: 461.25,
    description: 'Ticket médio das OSs concluídas no mês atual',
  })
  averageTicket!: number;

  @ApiProperty({
    example: 12,
    description: 'Quantidade de OSs com atendimento pendente ou em andamento',
  })
  openServiceOrdersCount!: number;

  @ApiProperty({
    example: 1,
    description: 'Quantidade de OSs com atendimento pendente ou em andamento',
  })
  completedServiceOrdersCount!: number;

  @ApiProperty({
    example: 3,
    description: 'Quantidade de OSs com atendimento pendente ou em andamento',
  })
  awaitingPaymentServiceOrdersCount!: number;

  @ApiProperty({
    example: 5200.0,
    description:
      'Valor total a receber das OSs não concluídas ou ainda não pagas',
  })
  totalPendingAmount!: number;

  @ApiProperty({
    type: [StatusBreakdownDto],
    description: 'Distribuição da quantidade de OSs agrupadas por status',
  })
  statusBreakdown!: StatusBreakdownDto[];

  @ApiProperty({
    type: [TopServiceItemDto],
    description: 'Top 5 serviços/manutenções mais frequentes na oficina',
  })
  topServices!: TopServiceItemDto[];

  @ApiProperty({
    type: [RevenueByMonthDto],
    description:
      'Histórico de faturamento acumulado mês a mês dos últimos 6 meses',
  })
  revenueLast6Months!: RevenueByMonthDto[];
}
