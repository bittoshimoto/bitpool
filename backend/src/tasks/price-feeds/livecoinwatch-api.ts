import axios from 'axios';
import logger from '../../logger';
import { PriceFeed, PriceHistory } from '../price-updater';

class LiveCoinWatchApi implements PriceFeed {
  public name: string = 'LiveCoinWatch';
  public currencies: string[] = ['USD']; // Keep it simple, only USD for now

  public url: string = 'https://api.livecoinwatch.com/coins/single';
  public urlHist: string = 'https://api.livecoinwatch.com/coins/single/history';

  private apiKey: string = 'e88d7b59-08a5-4765-a0e0-1b32d18314d8';

  private getHeaders() {
    return {
      'content-type': 'application/json',
      'x-api-key': this.apiKey
    };
  }

  public async $fetchPrice(currency: string): Promise<number> {
    try {
      const response = await axios.post(this.url, {
        currency,
        code: 'B1T',
        meta: true
      }, {
        headers: this.getHeaders()
      });

      if (response.data && response.data.rate) {
        return response.data.rate;
      } else {
        return -1;
      }
    } catch (error: any) {
      logger.err(`[LiveCoinWatch] Error fetching price for ${currency}: ${error.message}`);
      return -1;
    }
  }

  public async $fetchRecentPrice(currencies: string[], type: 'hour' | 'day'): Promise<PriceHistory> {
    const priceHistory: PriceHistory = {};
    const end = Math.floor(Date.now() / 1000);
    const start = end - (type === 'hour' ? 3600 * 24 : 86400 * 30); // Last 24h or 30d

    try {
      const response = await axios.post(this.urlHist, {
        currency: 'USD',
        code: 'B1T',
        start,
        end,
        meta: true
      }, {
        headers: this.getHeaders()
      });

      if (response.data && response.data.history) {
        for (const entry of response.data.history) {
          const time = Math.floor(entry.date / 1000);
          if (!priceHistory[time]) {
            priceHistory[time] = { USD: -1, EUR: -1, GBP: -1, CAD: -1, CHF: -1, AUD: -1, JPY: -1, BGN: -1, BRL: -1, CNY: -1, CZK: -1, DKK: -1, HKD: -1, HRK: -1, HUF: -1, IDR: -1, ILS: -1, INR: -1, ISK: -1, KRW: -1, MXN: -1, MYR: -1, NOK: -1, NZD: -1, PHP: -1, PLN: -1, RON: -1, RUB: -1, SEK: -1, SGD: -1, THB: -1, TRY: -1, ZAR: -1 };
          }
          priceHistory[time]['USD'] = entry.rate;
        }
      }

    } catch (error: any) {
      logger.err(`[LiveCoinWatch] Error fetching historical prices: ${error.message}`);
    }

    return priceHistory;
  }
}

export default LiveCoinWatchApi;
