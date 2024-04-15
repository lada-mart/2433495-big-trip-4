import { createFilterItemTemplate } from '../templates/filter-item-template.js';

export default class FilterItemView extends AbstractView{
  #filter = null;

  constructor (filter){
    super();
    this.#filter = filter;
  }

  get template() {
    return createFilterItemTemplate(this.#filter);
  }
}
