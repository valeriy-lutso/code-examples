import { all, put, takeLatest, call, select, throttle } from 'redux-saga/effects';
import { DeclarationStatus } from 'src/shared/declaration';
import { fetchPatients, setPatientStatus } from 'src/store/services/myPatients.service';

import {
  dispatchGetPatientsFailed,
  dispatchGetPatientsSuccess,
  dispatchPatientsRequest,
  dispatchSetPatientStatusFailed,
  dispatchSetPatientStatusSuccess,
  PATIENTS_REQUEST,
  SET_PATIENT_STATUS_REQUEST,
  SET_SEARCH_QUERY,
  SHOW_MORE_PATIENTS,
} from 'src/store/slices/my-patients/patients.action';
import { SetPatientStatusReqeust } from 'src/store/slices/my-patients/patients.types';

function* getPatientsSaga(): any {
  const showAccepted = yield select(state => state.myPatients.showAccepted);
  const sortBy = yield select(state => state.myPatients.sortBy);
  const searchQuery = yield select(state => state.myPatients.searchQuery);
  const limit = yield select(state => state.myPatients.limit);

  try {
    const response = yield call(() => {
      return fetchPatients(
        showAccepted ? DeclarationStatus.Accepted : DeclarationStatus.Terminated,
        sortBy,
        searchQuery,
        limit,
      );
    });
    yield put(
      dispatchGetPatientsSuccess({
        patients: response.data.patients,
        totalRecords: response.data.totalRecords,
      }),
    );
  } catch (error) {
    yield put(dispatchGetPatientsFailed({ error }));
  }
}

function* setPatientStatusSaga(action: SetPatientStatusReqeust): any {
  try {
    yield call(setPatientStatus, action.payload.declarationId, action.payload.status);
    yield put(dispatchSetPatientStatusSuccess());
  } catch (error) {
    yield put(dispatchSetPatientStatusFailed({ error }));
  }
  yield put(dispatchPatientsRequest());
}

function* setSearchQuerySaga(): any {
  yield put(dispatchPatientsRequest());
}

function* showMorePatientsSaga(): any {
  yield put(dispatchPatientsRequest());
}

function* myPatientsSaga() {
  yield all([
    throttle(700, SET_SEARCH_QUERY, setSearchQuerySaga),
    takeLatest(PATIENTS_REQUEST, getPatientsSaga),
    takeLatest(SHOW_MORE_PATIENTS, showMorePatientsSaga),
    takeLatest(SET_PATIENT_STATUS_REQUEST, setPatientStatusSaga),
  ]);
}

export default myPatientsSaga;
