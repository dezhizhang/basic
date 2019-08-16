import dva from 'dva';
import createLoading from 'dva-loading';
import createHistory from 'history/createHashHistory';
// import createHistory from 'history/createBrowserHistory';
import './index.less';
// 1. Initialize
const app = dva({
    history:createHistory()
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/global').default);
app.model(require('./models/baseInfo').default);
app.model(require('./models/menu').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
