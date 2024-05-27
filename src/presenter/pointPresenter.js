import RoutePointView from '../view/route-point-view.js';
import CurrentFormView from '../view/current-form-view.js';
import { RenderPosition, remove, render, replace } from '../framework/render.js';
import OpenFormBtnView from '../view/open-form-button-view.js';
import CloseFormBtnView from '../view/close-form-button-view.js';
import SaveFormBtnView from '../view/save-form-btn-view.js';
import {isEscapeButton} from '../utils/utils.js';
import OfferModel from '../model/offer-model.js';


import PointModel from '../model/point-model.js';


import { UserAction, UpdateType } from '../const.js';
import DeleteBtnView from '../view/delete-btn-view.js';


const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointsListView = null;
  #handlePointChange = null;
  #handleModeChange = null;
  #point = null;
  #mode = Mode.DEFAULT;

  #deleteButton = null;
  #pointComponent = null;
  #pointFormComponent = null;
  #offerModel = new OfferModel('not assigned');

  #pointModel = null;

  constructor ({pointListContainer, onDataChange, onModeChange, pointModel}) {

  #pointModel = new PointModel();


  #pointComponent = null;
  #pointFormComponent = null;

  #offerModel = new OfferModel('not assigned');
  #pointModel = new PointModel();

  constructor ({pointListContainer, onDataChange, onModeChange}) {

    this.#pointsListView = pointListContainer;
    this.#handlePointChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#pointModel = pointModel;
  }


  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevFormComponent = this.#pointFormComponent;


  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevFormComponent = this.#pointFormComponent;

    const escKeyDownBtnHandler = (evt) => {
      if (evt.key === 'Escape') {
        this.#replacePointToForm();
        document.removeEventListener('keydown', escKeyDownBtnHandler);
      }
    };

    this.#pointComponent = new RoutePointView({
      data: this.#point,
      onFavouriteClick: this.#handleFavouriteClick,
    });
    this.#pointFormComponent = new CurrentFormView({
      data: this.#point,

      onSubmit: this.#handleFormSubmit,
      pointModel: this.#pointModel,
      offerModel: this.#offerModel,
      resetButtons: this.resetButtons
    });
    this.#deleteButton = new DeleteBtnView ();
    if (prevPointComponent === null || prevFormComponent === null) {
      render(this.#pointComponent, this.#pointsListView);
      this.#deleteButton.element.addEventListener('click', () => this.#handleDeleteClick(CurrentFormView.parseStateToPoint(this.#pointFormComponent._state)));
      this.resetButtons();

      onSubmit: () => {
        this.#replacePointToForm();

        document.removeEventListener('keydown', this.#escKeyDownButtonHandler);
      },
      pointModel: this.#pointModel,
      offerModel: this.#offerModel
    });

    const deleteButton = this.#pointFormComponent.element.querySelector('.event__reset-btn');
    const openButton = new OpenFormBtnView({
      onClick: () => {
        this.#replaceFormToPoint();
        document.addEventListener('keydown', this.#escKeyDownButtonHandler);
      }});
    const closeButton = new CloseFormBtnView({
      onClick: () => {
        this.#replacePointToForm();
        document.removeEventListener('keydown', this.#escKeyDownButtonHandler);
      }});
    const saveButton = new SaveFormBtnView();
    render(openButton, this.#pointComponent.element, RenderPosition.BEFOREEND);
    render(saveButton, deleteButton, RenderPosition.BEFOREBEGIN);
    render(closeButton, deleteButton, RenderPosition.AFTEREND);

        document.removeEventListener('keydown', escKeyDownBtnHandler);
      }
    });

    const deleteBtn = this.#pointFormComponent.element.querySelector('.event__reset-btn');

    const openBtn = new OpenFormBtnView({
      onClick: () => {
        this.#replaceFormToPoint();
        document.addEventListener('keydown', escKeyDownBtnHandler);
      }});

    const closeBtn = new CloseFormBtnView({
      onClick: () => {
        this.#replacePointToForm();
        document.removeEventListener('keydown', escKeyDownBtnHandler);
      }});

    const saveBtn = new SaveFormBtnView();

    render(openBtn, this.#pointComponent.element, RenderPosition.BEFOREEND);
    render(saveBtn, deleteBtn, RenderPosition.BEFOREBEGIN);
    render(closeBtn, deleteBtn, RenderPosition.AFTEREND);


    if (prevPointComponent === null || prevFormComponent === null) {
      render(this.#pointComponent, this.#pointsListView);

      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#pointFormComponent, prevFormComponent);
    }
    remove(prevFormComponent);
    remove(prevPointComponent);
  }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointFormComponent, prevFormComponent);
    }

    remove(prevFormComponent);
    remove(prevPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointFormComponent);
  }
  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replacePointToForm();
    }
  }

  resetButtons = () => {
    const openButton = new OpenFormBtnView({
      onClick: () => {
        this.#replaceFormToPoint();
        this.resetButtons();
        document.addEventListener('keydown', this.#escKeyDownButtonHandler);
      }});
    const closeButton = new CloseFormBtnView({
      onClick: () => {
        this.#replacePointToForm();
        document.removeEventListener('keydown', this.#escKeyDownButtonHandler);
      }});
    const saveButton = new SaveFormBtnView();
    if (this.#mode === Mode.EDITING) {
      render(saveButton, this.#pointFormComponent.element.querySelector('.event__field-group--price'), RenderPosition.AFTEREND);
      render(closeButton, saveButton.element, RenderPosition.AFTEREND);
      render(this.#deleteButton, saveButton.element, RenderPosition.AFTEREND);
    }
    else {
      render(openButton, this.#pointComponent.element, RenderPosition.BEFOREEND);
    }
  };
  #replacePointToForm() {
    replace(this.#pointComponent, this.#pointFormComponent);
    this.#mode = Mode.DEFAULT;
  }
  #replaceFormToPoint() {
    replace(this.#pointFormComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }
  #handleFavouriteClick = () => {

    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };
  #handleFormSubmit = (update) => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update
    );
    this.#replaceFormToPoint();
  };
  #handleDeleteClick = (point) => {
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };


    this.#handlePointChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #escKeyDownButtonHandler = (evt) => {
    if (isEscapeButton(evt)) {
      this.#replacePointToForm();
      document.removeEventListener('keydown', this.#escKeyDownButtonHandler);
    }
  };


  #handleFavouriteClick = () => {
    this.#handlePointChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

}
