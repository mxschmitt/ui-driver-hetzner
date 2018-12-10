define('nodes/components/driver-hetzner/component', ['exports', 'shared/mixins/node-driver'], function (exports, _nodeDriver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var LAYOUT = "PHNlY3Rpb24gY2xhc3M9Imhvcml6b250YWwtZm9ybSI+CiAge3sjaWYgbmVlZEFQSVRva2VufX0KICA8Zm9ybT4KICAgIDxkaXYgY2xhc3M9Im92ZXItaHIgci1tYjIwIj4KICAgICAgPHNwYW4+QWNjb3VudCBBY2Nlc3M8L3NwYW4+CiAgICA8L2Rpdj4KICAgIDxkaXYgY2xhc3M9InJvdyBmb3JtLWdyb3VwIj4KICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTIiPgogICAgICAgIDxsYWJlbCBjbGFzcz0iZm9ybS1jb250cm9sLXN0YXRpYyI+QVBJIFRva2VuKjwvbGFiZWw+CiAgICAgIDwvZGl2PgogICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtMTAiPgogICAgICAgIHt7aW5wdXQgdHlwZT0icGFzc3dvcmQiIHZhbHVlPW1vZGVsLmhldHpuZXJDb25maWcuYXBpVG9rZW4gY2xhc3NOYW1lcz0iZm9ybS1jb250cm9sIiBwbGFjZWhvbGRlcj0iWW91ciBIZXR6bmVyIENsb3VkIEFQSSBUb2tlbiJ9fQogICAgICAgIDxwIGNsYXNzPSJoZWxwLWJsb2NrIj5DcmVhdGUgaXQgYnkgc3dpdGNoaW5nIGludG8gdGhlCiAgICAgICAgICA8YSB0YXJnZXQ9Il9ibGFuayIgaHJlZj0iaHR0cHM6Ly9jb25zb2xlLmhldHpuZXIuY2xvdWQiPkhldHpuZXIgQ2xvdWQgQ29uc29sZTwvYT4sIGNob29zaW5nIGEgcHJvamVjdCwgZ28gdG8gQWNjZXNzIOKGkiBUb2tlbnMgYW5kIGNyZWF0ZSBhIG5ldyBBUEkgdG9rZW4gdGhlcmUuPC9wPgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogICAge3t0b3AtZXJyb3JzIGVycm9ycz1lcnJvcnN9fQogICAgPGRpdiBjbGFzcz0iZm9vdGVyLWFjdGlvbnMiPgogICAgICB7eyNpZiBnZXR0aW5nRGF0YX19CiAgICAgIDxidXR0b24gY2xhc3M9ImJ0biBiZy1wcmltYXJ5IGJ0bi1kaXNhYmxlZCI+CiAgICAgICAgPGkgY2xhc3M9Imljb24gaWNvbi1zcGlubmVyIGljb24tc3BpbiI+PC9pPiB7e3QgJ2dlbmVyaWMubG9hZGluZyd9fTwvYnV0dG9uPgogICAgICB7e2Vsc2V9fQogICAgICA8YnV0dG9uIHt7YWN0aW9uICJnZXREYXRhIiB9fSBjbGFzcz0iYnRuIGJnLXByaW1hcnkiIGRpc2FibGVkPXt7bm90IG1vZGVsLmhldHpuZXJDb25maWcuYXBpVG9rZW59fT5Db25maWd1cmUgU2VydmVyPC9idXR0b24+CiAgICAgIHt7L2lmfX0KICAgICAgPGJ1dHRvbiB7e2FjdGlvbiAiY2FuY2VsIn19IGNsYXNzPSJidG4gYmctdHJhbnNwYXJlbnQiPnt7dCAnZ2VuZXJpYy5jYW5jZWwnfX08L2J1dHRvbj4KICAgIDwvZGl2PgogIDwvZm9ybT4KICB7e2Vsc2V9fQogIDxkaXYgY2xhc3M9ImNvbnRhaW5lci1mbHVpZCI+CiAgICB7eyEtLSBUaGlzIHBhcnRpYWwgY29udGFpbnMgdGhlIHF1YW50aXR5LCBuYW1lLCBhbmQgZGVzY3JpcHRpb24gZmllbGRzIC0tfX0KICAgIDxkaXYgY2xhc3M9Im92ZXItaHIiPgogICAgICA8c3Bhbj57e3RlbXBsYXRlT3B0aW9uc1RpdGxlfX08L3NwYW4+CiAgICA8L2Rpdj4KICAgIDxkaXYgY2xhc3M9Im92ZXItaHIgci1tdDIwIHItbWIyMCI+CiAgICAgIDxzcGFuPlJlZ2lvbjwvc3Bhbj4KICAgIDwvZGl2PgogICAgPGRpdiBjbGFzcz0icm93IGZvcm0tZ3JvdXAiPgogICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtMiI+CiAgICAgICAgPGxhYmVsIGNsYXNzPSJmb3JtLWNvbnRyb2wtc3RhdGljIj5SZWdpb248L2xhYmVsPgogICAgICA8L2Rpdj4KICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTEwIj4KICAgICAgICA8c2VsZWN0IGNsYXNzPSJmb3JtLWNvbnRyb2wiIG9uY2hhbmdlPXt7YWN0aW9uIChtdXQgbW9kZWwuaGV0em5lckNvbmZpZy5zZXJ2ZXJMb2NhdGlvbikgdmFsdWU9InRhcmdldC52YWx1ZSIgfX0+CiAgICAgICAgICB7eyNlYWNoIHJlZ2lvbkNob2ljZXMgYXMgfGNob2ljZXx9fQogICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt7Y2hvaWNlLm5hbWV9fSBzZWxlY3RlZD17e2VxIG1vZGVsLmhldHpuZXJDb25maWcuc2VydmVyTG9jYXRpb24gY2hvaWNlLm5hbWV9fT57e2Nob2ljZS5jaXR5fX08L29wdGlvbj4KICAgICAgICAgIHt7L2VhY2h9fQogICAgICAgIDwvc2VsZWN0PgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogICAgPGRpdiBjbGFzcz0ib3Zlci1ociByLW10MjAgci1tYjIwIj4KICAgICAgPHNwYW4+U2V0dGluZ3M8L3NwYW4+CiAgICA8L2Rpdj4KICAgIDxkaXYgY2xhc3M9InJvdyBmb3JtLWdyb3VwIj4KICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTIiPgogICAgICAgIDxsYWJlbCBjbGFzcz0iZm9ybS1jb250cm9sLXN0YXRpYyI+SW1hZ2U8L2xhYmVsPgogICAgICA8L2Rpdj4KICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTQiPgogICAgICAgIDxzZWxlY3QgY2xhc3M9ImZvcm0tY29udHJvbCIgb25jaGFuZ2U9e3thY3Rpb24gKG11dCBtb2RlbC5oZXR6bmVyQ29uZmlnLmltYWdlSWQpIHZhbHVlPSJ0YXJnZXQudmFsdWUiIH19PgogICAgICAgICAge3sjZWFjaCBpbWFnZUNob2ljZXMgYXMgfGNob2ljZXx9fQogICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt7Y2hvaWNlLmlkfX0gc2VsZWN0ZWQ9e3tlcSBtb2RlbC5oZXR6bmVyQ29uZmlnLmltYWdlSWQgY2hvaWNlLmlkfX0+e3tjaG9pY2UuZGVzY3JpcHRpb259fTwvb3B0aW9uPgogICAgICAgICAge3svZWFjaH19CiAgICAgICAgPC9zZWxlY3Q+CiAgICAgIDwvZGl2PgogICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtMiI+CiAgICAgICAgPGxhYmVsIGNsYXNzPSJmb3JtLWNvbnRyb2wtc3RhdGljIj5TaXplPC9sYWJlbD4KICAgICAgPC9kaXY+CiAgICAgIDxkaXYgY2xhc3M9ImNvbC1tZC00Ij4KICAgICAgICA8c2VsZWN0IGNsYXNzPSJmb3JtLWNvbnRyb2wiIG9uY2hhbmdlPXt7YWN0aW9uIChtdXQgbW9kZWwuaGV0em5lckNvbmZpZy5zZXJ2ZXJUeXBlKSB2YWx1ZT0idGFyZ2V0LnZhbHVlIiB9fT4KICAgICAgICAgIHt7I2VhY2ggc2l6ZUNob2ljZXMgYXMgfGNob2ljZXx9fQogICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt7Y2hvaWNlLm5hbWV9fSBzZWxlY3RlZD17e2VxIG1vZGVsLmhldHpuZXJDb25maWcuc2VydmVyVHlwZSBjaG9pY2UubmFtZX19Pnt7Y2hvaWNlLmRlc2NyaXB0aW9ufX0gLSB7e2Nob2ljZS5tZW1vcnl9fUdCIE1lbW9yeSAtIHt7Y2hvaWNlLmRpc2t9fUdCIERpc2sgc3BhY2U8L29wdGlvbj4KICAgICAgICAgIHt7L2VhY2h9fQogICAgICAgIDwvc2VsZWN0PgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogICAgPGRpdiBjbGFzcz0ib3Zlci1ociByLW10MjAgci1tYjIwIj4KICAgICAgPHNwYW4+VXNlciBkYXRhPC9zcGFuPgogICAgPC9kaXY+CiAgICA8ZGl2IGNsYXNzPSJyb3cgZm9ybS1ncm91cCI+CiAgICAgIDxkaXYgY2xhc3M9ImNvbC1tZC0yIj4KICAgICAgICA8bGFiZWwgY2xhc3M9ImZvcm0tY29udHJvbC1zdGF0aWMiPkNsb3VkLWluaXQgQ29uZmlndXJhdGlvbiAob3B0aW9uYWwpPC9sYWJlbD4KICAgICAgPC9kaXY+CiAgICAgIDxkaXYgY2xhc3M9ImNvbC1tZC0xMCI+CiAgICAgICAgPHRleHRhcmVhIHZhbHVlPXt7bW9kZWwuaGV0em5lckNvbmZpZy51c2VyRGF0YX19IG9uY2hhbmdlPXt7YWN0aW9uIChtdXQgbW9kZWwuaGV0em5lckNvbmZpZy51c2VyRGF0YSkgdmFsdWU9InRhcmdldC52YWx1ZSIgfX0gcm93cz0iMyIgc3R5bGU9IndpZHRoOiAxMDAlOyByZXNpemU6IHZlcnRpY2FsIj48L3RleHRhcmVhPgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogICAgIHt7IS0tIFRoaXMgZm9sbG93aW5nIGNvbnRhaW5zIHRoZSBOYW1lLCBMYWJlbHMgYW5kIEVuZ2luZSBPcHRpb25zIGZpZWxkcyAtLX19CiAgICAge3tmb3JtLW5hbWUtZGVzY3JpcHRpb24gbW9kZWw9bW9kZWwgbmFtZVJlcXVpcmVkPXRydWV9fQogICAgIHt7Zm9ybS11c2VyLWxhYmVscyBpbml0aWFsTGFiZWxzPWxhYmVsUmVzb3VyY2UubGFiZWxzIHNldExhYmVscz0oYWN0aW9uICdzZXRMYWJlbHMnKSBleHBhbmRBbGw9ZXhwYW5kQWxsIGV4cGFuZD0oYWN0aW9uIGV4cGFuZEZuKSB9fQogICAgIHt7Zm9ybS1lbmdpbmUtb3B0cyBtYWNoaW5lPW1vZGVsIHNob3dFbmdpbmVVcmw9c2hvd0VuZ2luZVVybCB9fQogICAgIHt7IS0tIFRoaXMgY29tcG9uZW50IHNob3dzIGVycm9ycyBwcm9kdWNlZCBieSB2YWxpZGF0ZSgpIGluIHRoZSBjb21wb25lbnQgLS19fQogICAgIHt7dG9wLWVycm9ycyBlcnJvcnM9ZXJyb3JzfX0KICAgICB7eyEtLSBUaGlzIGNvbXBvbmVudCBzaG93cyB0aGUgQ3JlYXRlIGFuZCBDYW5jZWwgYnV0dG9ucyAtLX19CiAgICAge3tzYXZlLWNhbmNlbCBzYXZlPSJzYXZlIiBjYW5jZWw9ImNhbmNlbCJ9fQogIDwvZGl2PgogIHt7L2lmfX0KPC9zZWN0aW9uPg==";

  var computed = Ember.computed;
  var get = Ember.get;
  var set = Ember.set;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;

  var defaultRadix = 10;
  var defaultBase = 1024;
  exports.default = Ember.Component.extend(_nodeDriver.default, {
    driverName: 'hetzner',
    needAPIToken: true,
    config: alias('model.hetznerConfig'),
    app: service(),

    init: function init() {
      var decodedLayout = window.atob(LAYOUT);
      var template = Ember.HTMLBars.compile(decodedLayout, {
        moduleName: 'nodes/components/driver-hetzner/template'
      });
      set(this, 'layout', template);

      this._super.apply(this, arguments);
    },

    bootstrap: function bootstrap() {
      var config = get(this, 'globalStore').createRecord({
        type: 'hetznerConfig',
        serverType: 'cx21',
        serverLocation: 'nbg1',
        imageId: 1,
        userData: ''
      });

      set(this, 'model.hetznerConfig', config);
      set(this, 'model.engineStorageDriver', 'overlay');
    },

    validate: function validate() {
      this._super();
      var errors = get(this, 'errors') || [];
      if (!get(this, 'model.name')) {
        errors.push('Name is required');
      }

      if (parseInt(get(this, 'config.memorySize'), defaultRadix) < defaultBase) {
        errors.push('Memory Size must be at least 1024 MB');
      }

      if (get(errors, 'length')) {
        set(this, 'errors', errors);
        return false;
      } else {
        set(this, 'errors', null);
        return true;
      }
    },

    actions: {
      getData: function getData() {
        this.set('gettingData', true);
        var that = this;
        Promise.all([this.apiRequest('/v1/locations'), this.apiRequest('/v1/images'), this.apiRequest('/v1/server_types')]).then(function (responses) {
          that.setProperties({
            errors: [],
            needAPIToken: false,
            gettingData: false,
            regionChoices: responses[0].locations,
            imageChoices: responses[1].images.filter(function (image) {
              return !/fedora/.test(image.name);
            }),
            sizeChoices: responses[2].server_types
          });
        }).catch(function (err) {
          err.then(function (msg) {
            that.setProperties({
              errors: ['Error received from Hetzner Cloud: ' + msg.error.message],
              gettingData: false
            });
          });
        });
      }
    },
    apiRequest: function apiRequest(path) {
      return fetch('https://api.hetzner.cloud' + path, {
        headers: {
          'Authorization': 'Bearer ' + this.get('model.hetznerConfig.apiToken')
        }
      }).then(function (res) {
        return res.ok ? res.json() : Promise.reject(res.json());
      });
    }
  });
});;
define('ui/components/driver-hetzner/component', ['exports', 'nodes/components/driver-hetzner/component'], function (exports, _component) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _component.default;
    }
  });
});