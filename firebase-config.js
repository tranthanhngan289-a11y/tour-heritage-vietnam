/**
 * Heritage Tours - Firebase Realtime Database & Cloud Firestore Module
 * Project ID: hanhtrinhdisan-8d83a
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_FIREBASE = 'heritage_firebase_config';

  // Your web app's official Firebase configuration
  const defaultFirebaseConfig = {
    apiKey: "AIzaSyCohuApZcNuWllgsjAwlya9_fLCipMnSRI",
    authDomain: "hanhtrinhdisan-8d83a.firebaseapp.com",
    projectId: "hanhtrinhdisan-8d83a",
    storageBucket: "hanhtrinhdisan-8d83a.firebasestorage.app",
    messagingSenderId: "8398990997",
    appId: "1:8398990997:web:74e3b3dc4510006288359c",
    measurementId: "G-30XD4PW0QM",
    databaseURL: "https://hanhtrinhdisan-8d83a-default-rtdb.firebaseio.com"
  };

  class FirebaseManager {
    constructor() {
      this.app = null;
      this.db = null;
      this.firestore = null;
      this.analytics = null;
      this.connected = false;
      this.mode = 'offline'; // 'firestore' | 'rtdb' | 'offline'
      this.init();
    }

    getConfig() {
      const stored = localStorage.getItem(STORAGE_KEY_FIREBASE);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.apiKey) {
            return { ...defaultFirebaseConfig, ...parsed };
          }
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

      if (!config.apiKey || config.apiKey === "YOUR_API_KEY") {
        this.connected = false;
        this.mode = 'offline';
        console.log('[Heritage Firebase] Running in Local / Offline mode.');
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

          // Initialize Analytics if supported
          try {
            if (typeof firebase.analytics === 'function') {
              this.analytics = firebase.analytics();
              console.log('[Heritage Firebase] Google Analytics initialized with ID:', config.measurementId);
            }
          } catch (e) {
            console.log('[Heritage Firebase] Analytics notice:', e.message);
          }

          // Initialize Firestore
          try {
            if (typeof firebase.firestore === 'function') {
              this.firestore = firebase.firestore();
              this.connected = true;
              this.mode = 'firestore';
              console.log('[Heritage Firebase] Cloud Firestore connected for project:', config.projectId);
            }
          } catch (e) {
            console.log('[Heritage Firebase] Firestore init note:', e.message);
          }

          // Initialize Realtime Database
          try {
            if (typeof firebase.database === 'function') {
              this.db = firebase.database();
              this.connected = true;
              if (this.mode === 'offline') this.mode = 'rtdb';
              console.log('[Heritage Firebase] Realtime Database connected');
            }
          } catch (e) {
            console.log('[Heritage Firebase] Realtime DB init note:', e.message);
          }

          this.notifyStatusChange();
        } else {
          console.warn('[Heritage Firebase] Firebase SDK not loaded in HTML');
          this.connected = false;
          this.mode = 'offline';
          this.notifyStatusChange();
        }
      } catch (err) {
        console.error('[Heritage Firebase] Initialization error:', err);
        this.connected = false;
        this.mode = 'offline';
        this.notifyStatusChange();
      }
    }

    isReady() {
      return this.connected && (this.firestore !== null || this.db !== null);
    }

    notifyStatusChange() {
      const statusEvent = new CustomEvent('heritage_firebase_status', {
        detail: { connected: this.connected, mode: this.mode }
      });
      window.dispatchEvent(statusEvent);
    }

    /**
     * Save a single booking to Firebase Cloud (Dual Firestore + Realtime DB support)
     */
    async saveBooking(booking) {
      if (!this.isReady()) {
        console.log('[Heritage Firebase] Saved locally (Firebase offline)');
        return false;
      }

      const payload = {
        ...booking,
        updatedAt: new Date().toISOString()
      };

      let success = false;

      // 1. Try Firestore
      if (this.firestore) {
        try {
          await this.firestore.collection('bookings').doc(booking.id).set(payload);
          success = true;
          console.log('[Heritage Firebase] Booking saved to Cloud Firestore:', booking.id);
        } catch (err) {
          console.warn('[Heritage Firebase] Firestore save error:', err.message);
        }
      }

      // 2. Try Realtime Database
      if (this.db) {
        try {
          await this.db.ref('bookings/' + booking.id).set(payload);
          success = true;
          console.log('[Heritage Firebase] Booking saved to Realtime Database:', booking.id);
        } catch (err) {
          console.warn('[Heritage Firebase] Realtime Database save error:', err.message);
        }
      }

      // Log Analytics Event if available
      if (this.analytics) {
        try {
          this.analytics.logEvent('generate_lead', {
            currency: 'VND',
            value: 10890000,
            package: booking.package
          });
        } catch (e) {}
      }

      return success;
    }

    /**
     * Listen for real-time bookings updates (for Admin Portal)
     */
    listenToBookings(callback) {
      if (!this.isReady()) return;

      // Listen via Firestore if available
      if (this.firestore) {
        try {
          this.firestore.collection('bookings').onSnapshot((snapshot) => {
            const list = [];
            snapshot.forEach(doc => list.push(doc.data()));
            list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
            if (list.length > 0) callback(list);
          }, (err) => {
            console.warn('[Heritage Firebase] Firestore snapshot error:', err);
          });
        } catch (e) {}
      }

      // Also listen via Realtime DB as fallback
      if (this.db) {
        try {
          this.db.ref('bookings').on('value', (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list = Object.values(val);
              list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
              callback(list);
            }
          }, (err) => {});
        } catch (e) {}
      }
    }

    /**
     * Update booking status in Cloud
     */
    async updateBookingStatus(bookingId, newStatus) {
      if (!this.isReady()) return false;
      let ok = false;

      if (this.firestore) {
        try {
          await this.firestore.collection('bookings').doc(bookingId).update({
            status: newStatus,
            updatedAt: new Date().toISOString()
          });
          ok = true;
        } catch (e) {}
      }

      if (this.db) {
        try {
          await this.db.ref('bookings/' + bookingId + '/status').set(newStatus);
          ok = true;
        } catch (e) {}
      }

      return ok;
    }

    /**
     * Delete booking from Cloud
     */
    async deleteBooking(bookingId) {
      if (!this.isReady()) return false;
      let ok = false;

      if (this.firestore) {
        try {
          await this.firestore.collection('bookings').doc(bookingId).delete();
          ok = true;
        } catch (e) {}
      }

      if (this.db) {
        try {
          await this.db.ref('bookings/' + bookingId).remove();
          ok = true;
        } catch (e) {}
      }

      return ok;
    }

    /**
     * Full Cloud Backup Snapshot
     */
    async createFullBackup() {
      if (!this.isReady()) throw new Error('Chưa kết nối Firebase! Vui lòng kiểm tra cấu hình.');

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

      // Save to Firestore
      if (this.firestore) {
        await this.firestore.collection('backups').doc(backupId).set(backupSnapshot);
        await this.firestore.collection('master_data').doc('latest').set({
          bookings,
          accounts,
          lastBackup: backupSnapshot.backupDate
        });
      }

      // Save to Realtime DB
      if (this.db) {
        await this.db.ref('backups/' + backupId).set(backupSnapshot);
        await this.db.ref('master_data').set({
          bookings,
          accounts,
          lastBackup: backupSnapshot.backupDate
        });
      }

      return { backupId, date: backupSnapshot.backupDate };
    }

    /**
     * Restore database from Cloud master snapshot
     */
    async restoreFromCloud() {
      if (!this.isReady()) throw new Error('Chưa kết nối Firebase!');

      let data = null;

      if (this.firestore) {
        try {
          const doc = await this.firestore.collection('master_data').doc('latest').get();
          if (doc.exists) data = doc.data();
        } catch (e) {}
      }

      if (!data && this.db) {
        try {
          const snapshot = await this.db.ref('master_data').once('value');
          data = snapshot.val();
        } catch (e) {}
      }

      if (!data) throw new Error('Chưa tìm thấy bản sao lưu nào trên Cloud Firebase!');

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
