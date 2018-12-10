define('nodes/components/driver-hetzner/component', ['exports', 'shared/mixins/node-driver'], function (exports, _nodeDriver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var LAYOUT = "PHNlY3Rpb24gY2xhc3M9Imhvcml6b250YWwtZm9ybSI+CiAge3sjaWYgbmVlZEFQSVRva2VufX0KICA8Zm9ybT4KICAgIDxkaXYgY2xhc3M9Im92ZXItaHIgci1tYjIwIj4KICAgICAgPHNwYW4+QWNjb3VudCBBY2Nlc3M8L3NwYW4+CiAgICA8L2Rpdj4KICAgIDxkaXYgY2xhc3M9InJvdyBmb3JtLWdyb3VwIj4KICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTIiPgogICAgICAgIDxsYWJlbCBjbGFzcz0iZm9ybS1jb250cm9sLXN0YXRpYyI+QVBJIFRva2VuKjwvbGFiZWw+CiAgICAgIDwvZGl2PgogICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtMTAiPgogICAgICAgIHt7aW5wdXQgdHlwZT0icGFzc3dvcmQiIHZhbHVlPW1vZGVsLmhldHpuZXJDb25maWcuYXBpVG9rZW4gY2xhc3NOYW1lcz0iZm9ybS1jb250cm9sIiBwbGFjZWhvbGRlcj0iWW91ciBIZXR6bmVyIENsb3VkIEFQSSBUb2tlbiJ9fQogICAgICAgIDxwIGNsYXNzPSJoZWxwLWJsb2NrIj5DcmVhdGUgaXQgYnkgc3dpdGNoaW5nIGludG8gdGhlCiAgICAgICAgICA8YSB0YXJnZXQ9Il9ibGFuayIgaHJlZj0iaHR0cHM6Ly9jb25zb2xlLmhldHpuZXIuY2xvdWQiPkhldHpuZXIgQ2xvdWQgQ29uc29sZTwvYT4sIGNob29zaW5nIGEgcHJvamVjdCwgZ28gdG8gQWNjZXNzIOKGkiBUb2tlbnMgYW5kIGNyZWF0ZSBhIG5ldyBBUEkgdG9rZW4gdGhlcmUuPC9wPgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogICAge3t0b3AtZXJyb3JzIGVycm9ycz1lcnJvcnN9fQogICAgPGRpdiBjbGFzcz0iZm9vdGVyLWFjdGlvbnMiPgogICAgICB7eyNpZiBnZXR0aW5nRGF0YX19CiAgICAgIDxidXR0b24gY2xhc3M9ImJ0biBiZy1wcmltYXJ5IGJ0bi1kaXNhYmxlZCI+CiAgICAgICAgPGkgY2xhc3M9Imljb24gaWNvbi1zcGlubmVyIGljb24tc3BpbiI+PC9pPiB7e3QgJ2dlbmVyaWMubG9hZGluZyd9fTwvYnV0dG9uPgogICAgICB7e2Vsc2V9fQogICAgICA8YnV0dG9uIHt7YWN0aW9uICJnZXREYXRhIiB9fSBjbGFzcz0iYnRuIGJnLXByaW1hcnkiIGRpc2FibGVkPXt7bm90IG1vZGVsLmhldHpuZXJDb25maWcuYXBpVG9rZW59fT5Db25maWd1cmUgU2VydmVyPC9idXR0b24+CiAgICAgIHt7L2lmfX0KICAgICAgPGJ1dHRvbiB7e2FjdGlvbiAiY2FuY2VsIn19IGNsYXNzPSJidG4gYmctdHJhbnNwYXJlbnQiPnt7dCAnZ2VuZXJpYy5jYW5jZWwnfX08L2J1dHRvbj4KICAgIDwvZGl2PgogIDwvZm9ybT4KICB7e2Vsc2V9fQogIDxkaXYgY2xhc3M9ImNvbnRhaW5lci1mbHVpZCI+CiAgICB7eyEtLSBUaGlzIHBhcnRpYWwgY29udGFpbnMgdGhlIHF1YW50aXR5LCBuYW1lLCBhbmQgZGVzY3JpcHRpb24gZmllbGRzIC0tfX0KICAgIDxkaXYgY2xhc3M9Im92ZXItaHIiPgogICAgICA8c3Bhbj57e3RlbXBsYXRlT3B0aW9uc1RpdGxlfX08L3NwYW4+CiAgICA8L2Rpdj4KICAgIDxkaXYgY2xhc3M9Im92ZXItaHIgci1tdDIwIHItbWIyMCI+CiAgICAgIDxzcGFuPlJlZ2lvbjwvc3Bhbj4KICAgIDwvZGl2PgogICAgPGRpdiBjbGFzcz0icm93IGZvcm0tZ3JvdXAiPgogICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtMiI+CiAgICAgICAgPGxhYmVsIGNsYXNzPSJmb3JtLWNvbnRyb2wtc3RhdGljIj5SZWdpb248L2xhYmVsPgogICAgICA8L2Rpdj4KICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTEwIj4KICAgICAgICA8c2VsZWN0IGNsYXNzPSJmb3JtLWNvbnRyb2wiIG9uY2hhbmdlPXt7YWN0aW9uIChtdXQgbW9kZWwuaGV0em5lckNvbmZpZy5zZXJ2ZXJMb2NhdGlvbikgdmFsdWU9InRhcmdldC52YWx1ZSIgfX0+CiAgICAgICAgICB7eyNlYWNoIHJlZ2lvbkNob2ljZXMgYXMgfGNob2ljZXx9fQogICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt7Y2hvaWNlLm5hbWV9fSBzZWxlY3RlZD17e2VxIG1vZGVsLmhldHpuZXJDb25maWcuc2VydmVyTG9jYXRpb24gY2hvaWNlLm5hbWV9fT57e2Nob2ljZS5jaXR5fX08L29wdGlvbj4KICAgICAgICAgIHt7L2VhY2h9fQogICAgICAgIDwvc2VsZWN0PgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogICAgPGRpdiBjbGFzcz0ib3Zlci1ociByLW10MjAgci1tYjIwIj4KICAgICAgPHNwYW4+U2V0dGluZ3M8L3NwYW4+CiAgICA8L2Rpdj4KICAgIDxkaXYgY2xhc3M9InJvdyBmb3JtLWdyb3VwIj4KICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTIiPgogICAgICAgIDxsYWJlbCBjbGFzcz0iZm9ybS1jb250cm9sLXN0YXRpYyI+SW1hZ2U8L2xhYmVsPgogICAgICA8L2Rpdj4KICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTQiPgogICAgICAgIDxzZWxlY3QgY2xhc3M9ImZvcm0tY29udHJvbCIgb25jaGFuZ2U9e3thY3Rpb24gKG11dCBtb2RlbC5oZXR6bmVyQ29uZmlnLmltYWdlKSB2YWx1ZT0idGFyZ2V0LnZhbHVlIiB9fT4KICAgICAgICAgIHt7I2VhY2ggaW1hZ2VDaG9pY2VzIGFzIHxjaG9pY2V8fX0KICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17e2Nob2ljZS5pZH19IHNlbGVjdGVkPXt7ZXEgbW9kZWwuaGV0em5lckNvbmZpZy5pbWFnZUlkIGNob2ljZS5pZH19Pnt7Y2hvaWNlLmRlc2NyaXB0aW9ufX08L29wdGlvbj4KICAgICAgICAgIHt7L2VhY2h9fQogICAgICAgIDwvc2VsZWN0PgogICAgICA8L2Rpdj4KICAgICAgPGRpdiBjbGFzcz0iY29sLW1kLTIiPgogICAgICAgIDxsYWJlbCBjbGFzcz0iZm9ybS1jb250cm9sLXN0YXRpYyI+U2l6ZTwvbGFiZWw+CiAgICAgIDwvZGl2PgogICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtNCI+CiAgICAgICAgPHNlbGVjdCBjbGFzcz0iZm9ybS1jb250cm9sIiBvbmNoYW5nZT17e2FjdGlvbiAobXV0IG1vZGVsLmhldHpuZXJDb25maWcuc2VydmVyVHlwZSkgdmFsdWU9InRhcmdldC52YWx1ZSIgfX0+CiAgICAgICAgICB7eyNlYWNoIHNpemVDaG9pY2VzIGFzIHxjaG9pY2V8fX0KICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17e2Nob2ljZS5uYW1lfX0gc2VsZWN0ZWQ9e3tlcSBtb2RlbC5oZXR6bmVyQ29uZmlnLnNlcnZlclR5cGUgY2hvaWNlLm5hbWV9fT57e2Nob2ljZS5kZXNjcmlwdGlvbn19IC0ge3tjaG9pY2UubWVtb3J5fX1HQiBNZW1vcnkgLSB7e2Nob2ljZS5kaXNrfX1HQiBEaXNrIHNwYWNlPC9vcHRpb24+CiAgICAgICAgICB7ey9lYWNofX0KICAgICAgICA8L3NlbGVjdD4KICAgICAgPC9kaXY+CiAgICA8L2Rpdj4KICAgIDxkaXYgY2xhc3M9Im92ZXItaHIgci1tdDIwIHItbWIyMCI+CiAgICAgIDxzcGFuPlVzZXIgZGF0YTwvc3Bhbj4KICAgIDwvZGl2PgogICAgPGRpdiBjbGFzcz0icm93IGZvcm0tZ3JvdXAiPgogICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtMiI+CiAgICAgICAgPGxhYmVsIGNsYXNzPSJmb3JtLWNvbnRyb2wtc3RhdGljIj5DbG91ZC1pbml0IENvbmZpZ3VyYXRpb24gKG9wdGlvbmFsKTwvbGFiZWw+CiAgICAgIDwvZGl2PgogICAgICA8ZGl2IGNsYXNzPSJjb2wtbWQtMTAiPgogICAgICAgIDx0ZXh0YXJlYSB2YWx1ZT17e21vZGVsLmhldHpuZXJDb25maWcudXNlckRhdGF9fSBvbmNoYW5nZT17e2FjdGlvbiAobXV0IG1vZGVsLmhldHpuZXJDb25maWcudXNlckRhdGEpIHZhbHVlPSJ0YXJnZXQudmFsdWUiIH19IHJvd3M9IjMiIHN0eWxlPSJ3aWR0aDogMTAwJTsgcmVzaXplOiB2ZXJ0aWNhbCI+PC90ZXh0YXJlYT4KICAgICAgPC9kaXY+CiAgICA8L2Rpdj4KICAgICB7eyEtLSBUaGlzIGZvbGxvd2luZyBjb250YWlucyB0aGUgTmFtZSwgTGFiZWxzIGFuZCBFbmdpbmUgT3B0aW9ucyBmaWVsZHMgLS19fQogICAgIHt7Zm9ybS1uYW1lLWRlc2NyaXB0aW9uIG1vZGVsPW1vZGVsIG5hbWVSZXF1aXJlZD10cnVlfX0KICAgICB7e2Zvcm0tdXNlci1sYWJlbHMgaW5pdGlhbExhYmVscz1sYWJlbFJlc291cmNlLmxhYmVscyBzZXRMYWJlbHM9KGFjdGlvbiAnc2V0TGFiZWxzJykgZXhwYW5kQWxsPWV4cGFuZEFsbCBleHBhbmQ9KGFjdGlvbiBleHBhbmRGbikgfX0KICAgICB7e2Zvcm0tZW5naW5lLW9wdHMgbWFjaGluZT1tb2RlbCBzaG93RW5naW5lVXJsPXNob3dFbmdpbmVVcmwgfX0KICAgICB7eyEtLSBUaGlzIGNvbXBvbmVudCBzaG93cyBlcnJvcnMgcHJvZHVjZWQgYnkgdmFsaWRhdGUoKSBpbiB0aGUgY29tcG9uZW50IC0tfX0KICAgICB7e3RvcC1lcnJvcnMgZXJyb3JzPWVycm9yc319CiAgICAge3shLS0gVGhpcyBjb21wb25lbnQgc2hvd3MgdGhlIENyZWF0ZSBhbmQgQ2FuY2VsIGJ1dHRvbnMgLS19fQogICAgIHt7c2F2ZS1jYW5jZWwgc2F2ZT0ic2F2ZSIgY2FuY2VsPSJjYW5jZWwifX0KICA8L2Rpdj4KICB7ey9pZn19Cjwvc2VjdGlvbj4=";

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