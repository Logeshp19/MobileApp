import { createStore ,applyMiddleware } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';

import rootSaga from './saga';
import rootReducer from './reducer';

const SagaMiddleware =createSagaMiddleware();
    const createSagaMiddleware = require('redux-saga').default;
const store = createStore(
    rootReducer,  
        {},
    composeWithDevTools(applyMiddleware(SagaMiddleware))
);
SagaMiddleware.run(rootSaga);

export default store;