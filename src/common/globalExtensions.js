const EventHelper = {
  events: {},
  dispatch: function (event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback: any) => callback(data));
  },
  subscribe: function (event: any, callback: any) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  },
};

module.exports = { EventHelper };
