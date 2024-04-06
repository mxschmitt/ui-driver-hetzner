/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import NodeDriver from 'shared/mixins/node-driver';

// import uiConstants from 'ui/utils/constants'

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed = Ember.computed;
const get = Ember.get;
const set = Ember.set;
const alias = Ember.computed.alias;
const service = Ember.inject.service;

/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/



/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(NodeDriver, {
  driverName: '%%DRIVERNAME%%',
  needAPIToken: true,
  config: alias('model.%%DRIVERNAME%%Config'),
  app: service(),

  init() {
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'nodes/components/driver-%%DRIVERNAME%%/template'
    });
    set(this, 'layout', template);

    this._super(...arguments);

  },
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

  // Write your component here, starting with setting 'model' to a machine with your config populated
  bootstrap: function () {
    // bootstrap is called by rancher ui on 'init', you're better off doing your setup here rather then the init function to ensure everything is setup correctly
    let config = get(this, 'globalStore').createRecord({
      type: '%%DRIVERNAME%%Config',
      additionalKey: [],
      serverType: 'cx21', // 4 GB Ram
      serverLocation: 'nbg1', // Nuremberg
      image: '',
      imageId: "168855", // ubuntu-18.04
      userData: '',
      networks: [],
      firewalls: [],
      usePrivateNetwork: false,
      serverLabel: [''],
      placementGroup: ''
    });

    set(this, 'model.%%DRIVERNAME%%Config', config);
  },

  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();

    if (!this.get('model.%%DRIVERNAME%%Config.networks')) {
      this.set('model.%%DRIVERNAME%%Config.networks', [])
    }

    if (!this.get('model.%%DRIVERNAME%%Config.firewalls')) {
      this.set('model.%%DRIVERNAME%%Config.firewalls', [])
    }

    if (!this.get('model.%%DRIVERNAME%%Config.serverLabel')) {
      this.set('model.%%DRIVERNAME%%Config.serverLabel', [])
    }

    if (!this.get('model.%%DRIVERNAME%%Config.additionalKey')) {
      this.set('model.%%DRIVERNAME%%Config.additionalKey', [])
    }

    var errors = get(this, 'errors') || [];
    if (!get(this, 'model.name')) {
      errors.push('Name is required');
    }

    // Set the array of errors for display,
    // and return true if saving should continue.
    if (get(errors, 'length')) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },
  actions: {
    getData() {
      this.set('gettingData', true);
      let that = this;
      Promise.all([this.apiRequest('/v1/locations'), this.apiRequest('/v1/images?per_page=50'), this.apiRequest('/v1/server_types'), this.apiRequest('/v1/networks'), this.apiRequest('/v1/ssh_keys'), this.apiRequest('/v1/firewalls'), this.apiRequest('/v1/placement_groups')]).then(function (responses) {
        that.setProperties({
          errors: [],
          needAPIToken: false,
          gettingData: false,
          regionChoices: responses[0].locations,
          imageChoices: responses[1].images
            .map(image => ({
              ...image,
              id: image.id.toString()
            })),
          sizeChoices: responses[2].server_types,
          networkChoices: responses[3].networks
            .map(network => ({
              ...network,
              id: network.id.toString()
            })),
          keyChoices: responses[4].ssh_keys
            .map(key => ({
              ...key,
              id: key.id.toString()
            })),
          firewallChoices: responses[5].firewalls
            .map(firewall => ({
              ...firewall,
              id: firewall.id.toString()
            })),
          placementGroupChoices: responses[6].placement_groups
        });
      }).catch(function (err) {
        err.then(function (msg) {
          that.setProperties({
            errors: ['Error received from Hetzner Cloud: ' + msg.error.message],
            gettingData: false
          })
        })
      })
    },
    modifyNetworks: function (select) {
      let options = [...select.target.options].filter(o => o.selected).map(o => o.value)
      this.set('model.%%DRIVERNAME%%Config.networks', options);
    },
    modifyFirewalls: function (select) {
      let options = [...select.target.options].filter(o => o.selected).map(o => o.value)
      this.set('model.%%DRIVERNAME%%Config.firewalls', options);
    },
    setLabels: function(labels){
      let labels_list = labels.map(l => l.key + "=" + l.value);
      this.set('model.%%DRIVERNAME%%Config.serverLabel', labels_list);

      this._super(labels);
    },
    modifyKeys: function (select) {
      let options = [...select.target.options]
        .filter(o => o.selected)
        .map(o => this.keyChoices.find(keyChoice => keyChoice.id == o.value)["public_key"]);
      this.set('model.%%DRIVERNAME%%Config.additionalKey', options);
    },
  },
  apiRequest(path) {
    return fetch('https://api.hetzner.cloud' + path, {
      headers: {
        'Authorization': 'Bearer ' + this.get('model.%%DRIVERNAME%%Config.apiToken'),
      },
    }).then(res => res.ok ? res.json() : Promise.reject(res.json()));
  }
  // Any computed properties or custom logic can go here
});
