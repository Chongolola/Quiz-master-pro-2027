import { AdMob, RewardAdOptions, BannerAdSize, BannerAdPosition, BannerAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// IDs do Google AdMob
// 1. Seu ID de BLOCO real (Rewarded Ad Unit ID)
const REWARDED_AD_UNIT_ID = 'ca-app-pub-3586961197855784/1467537670';
// 2. Seu ID de BLOCO real (Banner Ad Unit ID)
const BANNER_AD_UNIT_ID = 'ca-app-pub-3586961197855784/6862725777';
// 3. Seu ID de BLOCO real (Interstitial Ad Unit ID)
const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-3586961197855784/7929838397';

export class AdService {
  private static isInitialized = false;
  private static trackingAuthorized = false;

  static async initialize() {
    if (Capacitor.getPlatform() === 'web') return;
    
    try {
      await AdMob.requestTrackingAuthorization();
      const status = await AdMob.trackingAuthorizationStatus();
      this.trackingAuthorized = status.status === 'authorized';

      await AdMob.initialize({
        // Modo de produção ativado - IDs reais detectados
        initializeForTesting: false, 
      });
      
      this.isInitialized = true;
    } catch (e) {
      console.error('AdMob Init Error:', e);
    }
  }

  static async showRewardAd(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') {
      return new Promise((resolve) => setTimeout(() => resolve(true), 2000));
    }

    if (!this.isInitialized) await this.initialize();

    const options: RewardAdOptions = {
      adId: REWARDED_AD_UNIT_ID,
      npa: !this.trackingAuthorized, 
    };

    try {
      await AdMob.prepareRewardVideoAd(options);
      const reward = await AdMob.showRewardVideoAd();
      
      if (reward && reward.amount > 0) {
        return true;
      }
      return false;
    } catch (e) {
      console.error('Erro ao mostrar anúncio:', e);
      return false;
    }
  }

  static async showInterstitialAd() {
    if (Capacitor.getPlatform() === 'web') return;
    if (!this.isInitialized) await this.initialize();

    try {
      await AdMob.prepareInterstitial({
        adId: INTERSTITIAL_AD_UNIT_ID,
        npa: !this.trackingAuthorized,
      });
      await AdMob.showInterstitial();
    } catch (e) {
      console.error('Erro ao mostrar intersticial:', e);
    }
  }

  static async showBanner() {
    if (Capacitor.getPlatform() === 'web') return;
    if (!this.isInitialized) await this.initialize();

    const options: BannerAdOptions = {
      adId: BANNER_AD_UNIT_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      npa: !this.trackingAuthorized,
    };

    try {
      await AdMob.showBanner(options);
    } catch (e) {
      console.error('Erro ao mostrar banner:', e);
    }
  }

  static async hideBanner() {
    if (Capacitor.getPlatform() === 'web') return;
    try {
      await AdMob.removeBanner();
    } catch (e) {
      console.error('Erro ao remover banner:', e);
    }
  }
}
