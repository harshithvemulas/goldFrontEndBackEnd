import currencyRatesFetcher from '#services/currency_rates_fetcher';
import investmentService from '#services/investment_service';
import scheduler from 'adonisjs-scheduler/services/main';
scheduler
    .call(async () => {
    await currencyRatesFetcher();
})
    .hourly();
scheduler
    .call(async () => {
    await investmentService('daily');
})
    .daily();
scheduler
    .call(async () => {
    await investmentService('weekly');
})
    .weekly();
scheduler
    .call(async () => {
    await investmentService('monthly');
})
    .monthly();
scheduler
    .call(async () => {
    await investmentService('yearly');
})
    .yearly();
//# sourceMappingURL=scheduler.js.map