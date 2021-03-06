import { call, spawn, put, takeEvery, select } from "redux-saga/effects";
import axios from "axios";
import queryString from 'query-string';

import Immutable, {toJS} from 'immutable';


import * as config from '../../../config';

import * as actionsBasic from "../../actions/basic";
import * as actionsCard from "../../actions/card";
//import * as theme from "../../actions/theme";



const getListReward_request = (objQuery) => {
    
    console.log(objQuery)
    const query = queryString.stringify(objQuery);
    
    return axios.get(`${config.URL_BACK}/reward/?` + query);
};

// https://stackoverflow.com/questions/38605420/how-to-get-action-params-from-saga

function* matchReward(action) {
    
    const indexCardMatching = action.payload.indexCardMatching;
    
        yield put( actionsCard.return_REPLACE_CARD({
            location: ['listCard', indexCardMatching, 'status', 'reward', 'ready'],
            replacement: false
        }) );
        
        yield put( actionsCard.return_REPLACE_CARD({
            location: ['listCard', indexCardMatching, 'status', 'reward', 'loading'],
            replacement: true
        }) );
    
    
    const tagsReward =  yield select( (state) => state.card.getIn(['listCard', indexCardMatching, 'quiz', 'tagsReward']) ); 
    
    
    const objQuery = {
        filterKind: 'gif',
        filterTags: JSON.stringify(tagsReward.toJS())
    };
    
    //console.log('objQuery')
    //console.log(objQuery)
    
    try {
        const { data } = yield call( getListReward_request, objQuery );
            //console.log(data);
            //console.log('data');
        // data 는 listReward
        const rewardRandom = data[Math.floor(Math.random()*data.length)];
        
        // main
        yield put( actionsCard.return_REPLACE_CARD({
            location: ['listCard', indexCardMatching, 'reward'],
            replacement: rewardRandom
        }) );
        
        
        const card =  yield select( (state) => state.card.getIn(['listCard', indexCardMatching]) ); 
        console.log(card.toJS())
            
            
            yield put( actionsCard.return_REPLACE_CARD({
                location: ['listCard', indexCardMatching, 'status', 'reward', 'loading'],
                replacement: false
            }) );
            
            yield put( actionsCard.return_REPLACE_CARD({
                location: ['listCard', indexCardMatching, 'status', 'reward', 'ready'],
                replacement: true
            }) );
        
        
    } catch (error) {
        
            yield put( actionsCard.return_REPLACE_CARD({
                location: ['listCard', indexCardMatching, 'status', 'reward', 'loading'],
                replacement: false
            }) );
            
            yield put( actionsCard.return_REPLACE_CARD({
                location: ['listCard', indexCardMatching, 'status', 'reward', 'ready'],
                replacement: false
            }) );
            
        console.log(error);
        console.log('MATCH_REWARD has been failed');
        //yield put( korean.return_GET_LIST_COLOR_Assignment_FAILURE() )
    }
}

export default matchReward;


/*

        
        yield put({
            type: korean.REPLACE_COLOR_Assignment,
            payload: {
                location: ['listColorAssignment'],
                replacement: data
            }
        });
*/