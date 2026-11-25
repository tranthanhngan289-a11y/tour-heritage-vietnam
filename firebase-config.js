/**
 * Heritage Tours - Firebase Realtime Database & Cloud Backup Module
 * 
 * Supports:
 * 1. Automatic real-time cloud backup of all customer bookings from index.html
 * 2. Instant real-time synchronization with admin.html dashboard across any device
 * 3. 1-Click full database backup & restore from Admin Portal
 * 4. Graceful offline fallback to LocalStorage when Firebase is not yet configured
 */

(function(window) {
  'use strict';

  // Default / Template Firebase Credentials
  // Users can either edit this object or input credentials directly inside Admin Portal Settings!
  const STORAGE_KEY_FIREBASE = 'heritage_firebase_config';

  const defaultFirebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };

  class FirebaseManager {
    constructor() {
      this.app = null;
      this.db = null;
      this.connected = false;
      this.listeners = [];
      this.init();
    }

    getConfig() {
      const stored = localStorage.getItem(STORAGE_KEY_FIREBASE);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.warn('Invalid stored Firebase config', e);
        }
      }
      return defaultFirebaseConfig;
    }

    saveConfig(newConfig) {
      localStorage.setItem(STORAGE_KEY_FIREBASE, JSON.stringify(newConfig));
      this.init();
    }

    init() {
      const config = this.getConfig();
      if (!config.apiKey || !config.databaseURL || config.apiKey === "YOUR_API_KEY") {
        this.connected = false;
        console.log('[Heritage Firebase] Running in Local / Offline mode. (Firebase credentials not yet configured)');
        this.notifyStatusChange();
        return;
      }

      try {
        if (typeof firebase !== 'undefined') {
          if (!firebase.apps.length) {
            this.app = firebase.initializeApp(config);
          } else {
            this.app = firebase.app();
          }
          this.db = firebase.database();
          this.connected = true;
          console.log('[Heritage Firebase] Successfully connected to Firebase Realtime Database:', config.projectId);
          this.notifyStatusChange();
        } else {
          console.warn('[Heritage Firebase] Firebase SDK not loaded in HTML');
          this.connected = false;
          this.notifyStatusChange();
        }
      } catch (err) {
        console.error('[Heritage Firebase] Initialization error:', err);
        this.connected = false;
        this.notifyStatusChange();
      }
    }

    isReady() {
      return this.connected && this.db !== null;
    }

    notifyStatusChange() {
      const statusEvent = new CustomEvent('heritage_firebase_status', {
        detail: { connected: this.connected }
      });
      window.dispatchEvent(statusEvent);
    }

    /**
     * Save a single booking to Firebase Cloud
     */
    async saveBooking(booking) {
      if (!this.isReady()) {
        console.log('[Heritage Firebase] Saved locally (Firebase offline)');
        return false;
      }

      try {
        await this.db.ref('bookings/' + booking.id).set({
          ...booking,
          updatedAt: new Date().toISOString()
        });

        // Also update recent activity log
        await this.db.ref('activity_logs').push({
          time: new Date().toISOString().slice(0, 16).replace('T', ' '),
          user: booking.name,
          action: `Khách hàng đặt cọc/giữ chỗ mã ${booking.id} (${booking.phone})`
        });

        console.log('[Heritage Firebase] Successfully synced booking to Cloud:', booking.id);
        return true;
      } catch (error) {
        console.error('[Heritage Firebase] Failed to save booking to Firebase:', error);
        return false;
      }
    }

    /**
     * Listen for real-time bookings updates (for Admin Portal)
     */
    listenToBookings(callback) {
      if (!this.isReady()) return;

      this.db.ref('bookings').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const list = Object.values(val);
          // Sort newest first
          list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
          callback(list);
        } else {
          callback([]);
        }
      }, (err) => {
        console.error('[Heritage Firebase] Listen error:', err);
      });
    }

    /**
     * Update booking status in Cloud
     */
    async updateBookingStatus(bookingId, newStatus) {
      if (!this.isReady()) return false;
      try {
        await this.db.ref('bookings/' + bookingId + '/status').set(newStatus);
        return true;
      } catch (e) {
        console.error('[Heritage Firebase] Status update failed:', e);
        return false;
      }
    }

    /**
     * Delete booking from Cloud
     */
    async deleteBooking(bookingId) {
      if (!this.isReady()) return false;
      try {
        await this.db.ref('bookings/' + bookingId).remove();
        return true;
      } catch (e) {
        console.error('[Heritage Firebase] Delete failed:', e);
        return false;
      }
    }

    /**
     * Full Cloud Backup Snapshot: uploads all bookings, sub-admins, and analytics to /backups
     */
    async createFullBackup() {
      if (!this.isReady()) throw new Error('Chưa kết nối Firebase! Vui lòng nhập Firebase Config.');

      const bookings = JSON.parse(localStorage.getItem('heritage_bookings') || '[]');
      const accounts = JSON.parse(localStorage.getItem('heritage_admin_accounts') || '[]');
      const logs = JSON.parse(localStorage.getItem('heritage_system_logs') || '[]');
      const pageviews = localStorage.getItem('heritage_pageviews') || '1480';

      const backupSnapshot = {
        timestamp: new Date().toISOString(),
        backupDate: new Date().toLocaleString('vi-VN'),
        stats: {
          totalBookings: bookings.length,
          totalAccounts: accounts.length,
          pageviews: parseInt(pageviews)
        },
        data: {
          bookings,
          accounts,
          logs
        }
      };

      const backupId = 'backup_' + Date.now();
      await this.db.ref('backups/' + backupId).set(backupSnapshot);
      
      // Also update master dataset
      await this.db.ref('master_data').set({
        bookings,
        accounts,
        lastBackup: backupSnapshot.backupDate
      });

      return { backupId, date: backupSnapshot.backupDate };
    }

    /**
     * Restore database from Cloud master snapshot
     */
    async restoreFromCloud() {
      if (!this.isReady()) throw new Error('Chưa kết nối Firebase!');

      const snapshot = await this.db.ref('master_data').once('value');
      const data = snapshot.val();
      if (!data) throw new Error('Chưa có bản sao lưu nào trên Cloud Firebase!');

      if (data.bookings) {
        localStorage.setItem('heritage_bookings', JSON.stringify(data.bookings));
      }
      if (data.accounts) {
        localStorage.setItem('heritage_admin_accounts', JSON.stringify(data.accounts));
      }

      return data;
    }
  }

  // Expose global instance
  window.HeritageFirebase = new FirebaseManager();

})(window);
