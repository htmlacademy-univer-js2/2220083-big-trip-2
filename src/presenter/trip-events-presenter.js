import TripEventsView from '../view/trip-events-view.js';
import RoutePointView from '../view/route-point-view.js';
import EditingFormView from '../view/editing-form-view.js';
import SortingView from '../view/sorting-view.js';
import { render } from '../render.js';

export default class TripEventsPresenter {
  #eventsList = null;
  #pointsModel = null;
  #boardPoints = null;
  #destinations = null;
  #offers = null;

  constructor(tripContainer) {
    this.#eventsList = new TripEventsView();
    this.tripContainer = tripContainer;
  }

  init (pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    render(new SortingView(), this.tripContainer);
    render(this.#eventsList, this.tripContainer);

    for (const point of this.#boardPoints){
      this.#renderPoint(point);
    }
  }

  #renderPoint (point) {
    const pointComponent = new RoutePointView(point, this.#destinations, this.#offers);
    const editPointComponent = new EditingFormView(point, this.#destinations, this.#offers);

    const replacePointToEditForm = () => {
      this.#eventsList.element.replaceChild(editPointComponent.element, pointComponent.element);
    };

    const replaceEditFormToPoint = () => {
      this.#eventsList.element.replaceChild(pointComponent.element, editPointComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#eventsList.element);
  };
}
