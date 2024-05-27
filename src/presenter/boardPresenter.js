import PointsListView from '../view/points-list-view.js';
import SortFormView from '../view/sort-form-view.js';

import { RenderPosition, render, remove } from '../framework/render.js';
import NoPointsView from '../view/no-points-view.js';
import MainTripView from '../view/main-trip-view.js';
import PointPresenter from './pointPresenter.js';
import {filter} from '../utils/filter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import SortItemView from '../view/sort-item-view.js';
import {sortPointsByPrice, sortPointsByTime} from '../mock/point.js';
import NewPointPresenter from '../presenter/new-point-presenter.js';
import LoadingView from '../view/loading-view.js';

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

  #loadingComponent = new LoadingView();
  #isLoading = true;

  #sortComponent = null;
  #noPointsComponent = null;
  #mainTrip = new MainTripView();
  #container = null;
  #pointModel = null;
  #filterModel = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DATE;
  #filterType = FilterType.EVERYTHING;
  #tripControls = document.querySelector('.trip-main__trip-controls');
  constructor ({container, pointModel, filterModel, onNewPointDestroy}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointsListView.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });
  }
  createPoint() {
    this.#currentSortType = SortType.DATE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }
  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch(this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
    }
    return filteredPoints;

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

    render(this.#sortFormView, this.#container);
    this.#renderSort();
    this.#renderPointsList();
  }
  #renderPoint (point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListView.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      pointModel: this.#pointModel
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };


    this.#boardPoint = [...this.#pointModel.getPoints()];

}
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
import { SortType } from '../const.js';
import SortItemView from '../view/sort-item-view.js';
import {sortPointsByPrice, sortPointsByTime} from '../mock/point.js';
export default class BoardPresenter {
  #sortFormView = new SortFormView();
  #pointsListView = new PointsListView();
  #sortComponent = null;
  #noPointsView = new NoPointsView();
  #mainTrip = new MainTripView();
  #filterFormView = new FilterFormView();
  #container = null;
  #pointModel = null;
  #boardPoint = [];
  #pointPresenters = new Map();
  #currentSortType = SortType.DATE;
  #sourcedBoardPoints = [];
  #tripControls = document.querySelector('.trip-main__trip-controls');
  constructor ({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }
  init() {
    this.#boardPoint = [...this.#pointModel.getPoints()];
    this.#sourcedBoardPoints = [...this.#pointModel.getPoints()];
    const filterFormContainer = document.querySelector('.trip-controls__filters');
    const filters = generateFilter(this.#boardPoint);
    render(this.#filterFormView, filterFormContainer);
    render(this.#sortFormView, this.#container);
    for (const elem in SortType) {
      this.#renderSort(SortType[elem]);
    }
    const daySort = this.#sortFormView.element.querySelector('.trip-sort__item--day');
    const priceSort = this.#sortFormView.element.querySelector('.trip-sort__item--price');
    render(new SortItemView({
      sort: 'event',
      onSortTypeChange: this.#handleSortTypeChange
    }), daySort, RenderPosition.AFTEREND);
    render(new SortItemView({
      sort: 'offer',
      onSortTypeChange: this.#handleSortTypeChange
    }), priceSort, RenderPosition.AFTEREND);
    for (let i = 0; i < filters.length; i++) {
      render(new FilterItemView(filters[i]), this.#filterFormView.element);
    }
    this.#renderPointsList();
  }
  #renderPoint (point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListView.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
  #handlePointChange = (updatedPoint) => {
    this.#boardPoint = updateItem(this.#boardPoint, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#boardPoint, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };
  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointsList({resetSortType: false});
    this.#renderPointsList();
  };
  #renderSort () {
    for (const elem in SortType) {
      this.#sortComponent = new SortItemView({
        sort: SortType[elem],
        onSortTypeChange: this.#handleSortTypeChange
      });
      render(this.#sortComponent, this.#sortFormView.element);

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  };
  #renderSort (sort) {
    this.#sortComponent = new SortItemView({
      sort: sort,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#sortFormView.element);
  }
  #sortPoints(sortType) {
    switch(sortType) {
      case SortType.PRICE:
        this.#boardPoint.sort(sortPointsByPrice);
        break;
      case SortType.TIME:
        this.#boardPoint.sort(sortPointsByTime);
        break;
      default:
        this.#boardPoint = [...this.#sourcedBoardPoints];
    }
    this.#currentSortType = sortType;
  }
  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
  #renderPointsList() {
    if (this.#boardPoint.length > 0) {
      render(this.#mainTrip, this.#tripControls, RenderPosition.BEFOREBEGIN);
      render(this.#pointsListView, this.#container);
      for (let i = 0; i < this.#boardPoint.length; i++) {
        this.#renderPoint(this.#boardPoint[i]);
      }
    }
    else {
      render(this.#noPointsView, this.#container);

    }
    const daySort = this.#sortFormView.element.querySelector('.trip-sort__item--day');
    const priceSort = this.#sortFormView.element.querySelector('.trip-sort__item--price');
    render(new SortItemView({
      sort: 'event',
      onSortTypeChange: this.#handleSortTypeChange
    }), daySort, RenderPosition.AFTEREND);
    render(new SortItemView({
      sort: 'offer',
      onSortTypeChange: this.#handleSortTypeChange
    }), priceSort, RenderPosition.AFTEREND);
  }
  #clearPointsList({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    if (resetSortType) {
      this.#currentSortType = SortType.DATE;
    }

    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }
  }

  #renderPointsList() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const pointsCount = this.points.length;
    if (pointsCount > 0) {
      render(this.#mainTrip, this.#tripControls, RenderPosition.BEFOREBEGIN);
      render(this.#pointsListView, this.#container);
      for (let i = 0; i < this.points.length; i++) {
        this.#renderPoint(this.points[i]);
      }
    }
    else {
      this.#renderNoTasks();
    }
  }
  #renderNoTasks() {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterType
    });
    render(this.#noPointsComponent, this.#container);
  }
  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MAJOR:
        this.#clearPointsList();
        this.#renderPointsList();
        break;
      case UpdateType.MINOR:
        this.#clearPointsList({resetSortType: true});
        this.#renderPointsList();
        break;
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPointsList();
        break;
    }
  };
}
