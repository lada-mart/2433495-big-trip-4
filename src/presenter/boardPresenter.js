import PointsListView from '../view/points-list-view.js';
import SortFormView from '../view/sort-form-view.js';
import { RenderPosition, render } from '../framework/render.js';
import NoPointsView from '../view/no-points-view.js';
import FilterFormView from '../view/filter-form-view.js';
import MainTripView from '../view/main-trip-view.js';
import { generateFilter } from '../mock/filters.js';
import FilterItemView from '../view/filter-item-view.js';
import PointPresenter from './pointPresenter.js';
import { updateItem } from '../utils/utils.js';

export default class BoardPresenter {
  #sortFormView = new SortFormView();
  #pointsListView = new PointsListView();
  #noPointsView = new NoPointsView();
  #mainTrip = new MainTripView();
  #filterFormView = new FilterFormView();
  #container = null;
  #pointModel = null;
  #boardPoint = [];
  #pointPresenters = new Map();

  constructor ({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }
  init() {
    this.#boardPoint = [...this.#pointModel.getPoints()];

}
