import {
  CLOSE_VACCINE_MODAL_PANEL,
  DELETE_VACCINE_FAILED,
  DELETE_VACCINE_REQUEST,
  DELETE_VACCINE_SUCCESS,
  EDIT_VACCINE_FAILED,
  EDIT_VACCINE_INIT_SUCCESS,
  EDIT_VACCINE_REQUEST,
  EDIT_VACCINE_SUCCESS,
  GET_VACCINE_DETAILS_FAILED,
  GET_VACCINE_DETAILS_REQUEST,
  GET_VACCINE_DETAILS_SUCCESS,
} from '../vaccines/vaccines.action';
import { VaccineData } from '../vaccines/vaccines.types';
import {
  GET_PATIENT_DETAILS_FAILED,
  GET_PATIENT_DETAILS_SUCCESS,
  PATIENT_DETAILS_REQUEST,
} from './patient-details.action';
import { PatientDetailsActionTypes, PatientDetailsData } from './patient-details.types';

interface PatientDetailsState {
  patientDetails: PatientDetailsData;
  pending: boolean;
  error: any;
  openVaccineDetails: VaccineData;
  panelStatus: string;
}

const initialState: PatientDetailsState = {
  patientDetails: {} as PatientDetailsData,
  pending: false,
  error: null,
  openVaccineDetails: {} as VaccineData,
  panelStatus: 'none',
};

const patientDetailsReducer = (state = initialState, action: PatientDetailsActionTypes) => {
  switch (action.type) {
    case CLOSE_VACCINE_MODAL_PANEL:
      return { ...state, panelStatus: initialState.panelStatus };
    case PATIENT_DETAILS_REQUEST:
      return { ...state, pending: true };
    case GET_PATIENT_DETAILS_SUCCESS:
      return {
        ...state,
        patientDetails: action.payload.patientDetails,
        pending: false,
        error: null,
      };
    case GET_PATIENT_DETAILS_FAILED:
      return {
        ...state,
        error: action.payload,
        pending: false,
        patientDetails: initialState.patientDetails,
      };
    case GET_VACCINE_DETAILS_REQUEST:
      return { ...state, pending: true };
    case GET_VACCINE_DETAILS_SUCCESS:
      return {
        ...state,
        openVaccineDetails: action.payload,
        pending: false,
        error: null,
        panelStatus: 'view',
      };
    case GET_VACCINE_DETAILS_FAILED:
      return {
        ...state,
        error: action.payload,
        pending: false,
        panelStatus: initialState.panelStatus,
      };
    case DELETE_VACCINE_REQUEST:
      return { ...state, pending: true };
    case DELETE_VACCINE_SUCCESS:
      return {
        ...state,
        openVaccineDetails: initialState.openVaccineDetails,
        pending: false,
        error: null,
        panelStatus: 'none',
      };
    case DELETE_VACCINE_FAILED:
      return {
        ...state,
        error: action.payload,
        pending: false,
      };
    case EDIT_VACCINE_INIT_SUCCESS:
      return {
        ...state,
        openVaccineDetails: action.payload,
        pending: false,
        error: null,
        panelStatus: 'edit',
      };
    case EDIT_VACCINE_REQUEST:
      return { ...state, pending: true };
    case EDIT_VACCINE_SUCCESS:
      return {
        ...state,
        openVaccineDetails: initialState.openVaccineDetails,
        pending: false,
        error: null,
        panelStatus: 'none',
      };
    case EDIT_VACCINE_FAILED:
      return {
        ...state,
        error: action.payload,
        pending: false,
      };
    default:
      return state;
  }
};

export default patientDetailsReducer;
