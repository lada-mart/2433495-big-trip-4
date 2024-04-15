import BoardPresenter from './presenter/boardPresenter.js';
import { RenderPosition, render } from './render.js';
import FilterFormView from './view/filter-form-view.js';
import MainTrip from './view/main-trip-view.js';

const mainTrip = new MainTrip ();
const tripControls = document.querySelector('.trip-main__trip-controls');

const filterFormView = new FilterFormView();
const filterFormContainer = document.querySelector('.trip-controls__filters');
const tripInfoContainer = document.querySelector('.trip-events');

render(mainTrip, tripControls, RenderPosition.BEFOREBEGIN);
render(filterFormView, filterFormContainer);

const boardPresenter = new BoardPresenter({container: tripInfoContainer});
boardPresenter.init();
