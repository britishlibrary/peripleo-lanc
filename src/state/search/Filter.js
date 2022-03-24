export default class Filter {

  constructor(facet, arg) {
    this.facet = facet;
    this.values = Array.isArray(arg) ? arg : [ arg ];
  }

  equals = filter =>
    filter.facet === this.facet && filter.value === this.value;

}
