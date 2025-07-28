import actionTypes from "../actionTypes"

const initial = {
    postAunthendicationEmployeeLoading: false,
    userToken: null,
    postAunthendicationEmployeeData: null,
    postAunthendicationEmployeeError: null,
    postAunthendicationEmployeeErrorInvalid: null,
}

const postAunthendicationEmployeeReducer = (state=initial, action) => {
    switch(action.type){
        case actionTypes.POST_AUTHENDICATION_EMPLOYEE_REQUEST:
            return {
                ...state,
                postAunthendicationEmployeeLoading: true,
                userToken: action.payload.token 
            }
        case actionTypes.POST_AUTHENDICATION_EMPLOYEE_SUCCESS:
            return {
                ...state,
                postAunthendicationEmployeeLoading: false,
                postAunthendicationEmployeeData: action.payload,
                userToken: action.payload?.AccessToken || undefined,
                postAunthendicationEmployeeError: null,
                postAunthendicationEmployeeErrorInvalid: null
            }
            case 'SET_AUTH_TOKEN':
                return{
                    ...state,
                    userToken: action.payload.token || undefined,
                    postAunthendicationEmployeeData: {Data: action.payload.userdata} || undefined,

                }
        case actionTypes.POST_AUTHENDICATION_EMPLOYEE_FAILURE:
            return {
                ...state,
                postAunthendicationEmployeeLoading: false,
                postAunthendicationEmployeeData: [],
                postAunthendicationEmployeeError: action.payload,
                userToken: null
            }
        case actionTypes.POST_AUTHENDICATION_EMPLOYEE_FAILURE_INVALID:
            return {
                ...state,
                postAunthendicationEmployeeLoading: false,
                postAunthendicationEmployeeData: [],
                postAunthendicationEmployeeError: null,
                postAunthendicationEmployeeErrorInvalid: action.payload,
                userToken: null
            }
        case actionTypes.CLEAR_AUTHENDICATION_FIELDS:
            return {
                postAunthendicationEmployeeLoading: false,
                userToken: null,
                postAunthendicationEmployeeData: null,
                postAunthendicationEmployeeError: null,
                postAunthendicationEmployeeErrorInvalid: null,
            }
        default:
            return state;
    }
}

export default postAunthendicationEmployeeReducer;
