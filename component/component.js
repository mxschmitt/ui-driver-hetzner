/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import NodeDriver from 'shared/mixins/node-driver'

// import uiConstants from 'ui/utils/constants'

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we don't want to export the modules in the amd def
const computed = Ember.computed;
const get = Ember.get;
const set = Ember.set;
const alias = Ember.computed.alias;
const service = Ember.inject.service
import { apiRequest, getNetworksByZone } from './hetzner'
/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/



/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(NodeDriver, {
  driverName: '%%DRIVERNAME%%',
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

    const apiToken = this.get('model.%%DRIVERNAME%%Config.apiToken')
    if (apiToken) {
      apiRequest(apiToken, '/v1/locations')
        .then(() => set(this, 'needAPIToken', false))
        .catch(() => set(this, 'needAPIToken', true))
      this.actions.getData.bind(this)()
    } else {
      this.set('needAPIToken', true)
    }
  },
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

  // Write your component here, starting with setting 'model' to a machine with your config populated
  bootstrap () {
    // bootstrap is called by rancher ui on 'init', you're better off doing your setup here rather then the init function to ensure everything is setup correctly
    let config = get(this, 'globalStore').createRecord({
      type: '%%DRIVERNAME%%Config',
      additionalKey: [],
      serverType: '',
      serverLocation: '',
      image: '',
      imageId: "",
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

    if (!this.get('model.%%DRIVERNAME%%Config.networks')) this.set('model.%%DRIVERNAME%%Config.networks', [])
    if (!this.get('model.%%DRIVERNAME%%Config.firewalls')) this.set('model.%%DRIVERNAME%%Config.firewalls', [])
    if (!this.get('model.%%DRIVERNAME%%Config.serverLabel')) this.set('model.%%DRIVERNAME%%Config.serverLabel', [])
    if (!this.get('model.%%DRIVERNAME%%Config.additionalKey')) this.set('model.%%DRIVERNAME%%Config.additionalKey', [])

    var errors = get(this, 'errors') || [];
    if (!get(this, 'model.name')) errors.push('Name is required')

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
    async getData() {
      this.set('gettingData', true);
      const apiKey = this.get('model.%%DRIVERNAME%%Config.apiToken')
      try {
        const baseHetznerData = Promise.all([
          apiRequest(apiKey, '/v1/locations'),
          apiRequest(apiKey, '/v1/server_types'),
          apiRequest(apiKey, '/v1/ssh_keys'),
          apiRequest(apiKey, '/v1/firewalls'),
          apiRequest(apiKey, '/v1/placement_groups')
        ])
        const selectedServerLocation = this.get('model.%%DRIVERNAME%%Config.serverLocation')
        const selectedServerType = this.get('model.%%DRIVERNAME%%Config.serverType')
        let imageChoices = []
        let networkChoices = []
        const [
          locations,
          serverTypes,
          sshKeys,
          firewalls,
          placementGroups
        ] = await baseHetznerData

        if (selectedServerLocation) {
          const serverLocation = locations.locations.filter(i => i.name === selectedServerLocation)[0]
          const regionNetworks = (await getNetworksByZone(apiKey, serverLocation.network_zone))
            .map(i => ({ ...i, id: i.id.toString() }))
          networkChoices = regionNetworks
        }

        if (selectedServerType) {
          const serverType = serverTypes.server_types.filter(i => i.name === selectedServerType)[0]
          imageChoices = (await apiRequest(apiKey, '/v1/images', { type: ['system', 'snapshot', 'backup'], architecture: serverType.architecture })).images
            .sort((a, b) => a.name > b.name ? 1 : -1)
        }

        this.setProperties({
          errors: [],
          needAPIToken: false,
          gettingData: false,
          regionChoices: locations.locations,
          imageChoices,
          serverTypeChoices: serverTypes.server_types,
          networkChoices,
          keyChoices: sshKeys.ssh_keys
            .map(key => ({
              ...key,
              id: key.id.toString()
            })),
          firewallChoices: firewalls.firewalls
            .map(firewall => ({
              ...firewall,
              id: firewall.id.toString()
            })),
          placementGroupChoices: placementGroups.placement_groups
        })
      } catch(err) {
        console.log(err)
        this.setProperties({
          errors: ['Error received from Hetzner Cloud: ' + err.message],
          gettingData: false
        })
      }
    },
    async updateServerLocation(select) {
      const apiKey = this.get('model.%%DRIVERNAME%%Config.apiToken')

      let options = [...select.target.options].filter(o => o.selected)
      const regionChoices = this.get('regionChoices')
      const regionDetails = regionChoices.filter(i => i.name == options[0].value)[0]

      this.set('model.%%DRIVERNAME%%Config.serverLocation', options[0].value)
      const regionNetworks = (await getNetworksByZone(apiKey, regionDetails.network_zone))
        .map(i => ({ ...i, id: i.id.toString() }))
      this.set('networkChoices', regionNetworks)
    },
    async updateServerType(select) {
      const apiKey = this.get('model.%%DRIVERNAME%%Config.apiToken')
      let options = [...select.target.options].filter(o => o.selected)
      const serverTypeChoices = this.get('serverTypeChoices')
      const choice = serverTypeChoices.filter(i => i.name == options[0].value)[0]
      const allImages = (await apiRequest(apiKey, '/v1/images', { type: ['system', 'snapshot', 'backup'], architecture: choice.architecture })).images
      this.set('imageChoices', allImages.sort((a, b) => a.name > b.name ? 1 : -1))
      this.set('model.%%DRIVERNAME%%Config.serverType', options[0].value)
    },
    updateImage(select) {
      let options = [...select.target.options].filter(o => o.selected)
      const imageChoices = this.get('imageChoices')
      const imageChoice = imageChoices.filter(i => i.id.toString() === options[0].value)[0]
      this.set('model.%%DRIVERNAME%%Config.imageId', imageChoice.id)
      this.set('model.%%DRIVERNAME%%Config.image', imageChoice.name)
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
    changeToken: function(){
      this.set('needAPIToken', true)
    },
  }
  // Any computed properties or custom logic can go here
});
