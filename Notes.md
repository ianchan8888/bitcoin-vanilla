// Tells how to transform the current Redux store state into the props you want to pass to a presentational component you are wrapping.
// If this argument is specified, the new component will subscribe to Redux store updates. This means that any time the store is updated, mapStateToProps will be called. 
// If a function is passed, it will be given dispatch as the first parameter

// React Redux library's connect() function, which provides many useful optimizations to prevent unnecessary re-renders.
// Connects a React component to a Redux store. 
// It returns a new, connected component class for you to use


// Reducers - specify how the application's state changes in response to actions sent to store
// Design the shape of your application's state 
// All the application state is stored as a single object

// When an action creator returns a function, that function will get executed by the Redux Thunk middleware. 
// This function doesn't need to be pure; it is thus allowed to have side effects, including executing asynchronous API calls. 
// The function can also dispatch actions—like those synchronous actions we defined earlier.
// With asynchronous code, there is more state to take care of

// The goal of our WebSocket middleware is to allow bi-directional access to a WebSocket connection through the dispatch of actions. 
/* 
The key feature of middleware is that it is composable. Multiple middleware can be combined together,
where each middleware requires no knowledge of what comes before or after it in the chain.
Each middleware receives Store's dispatch and getState functions as named arguments, and returns a function. 
*/
/* 
middleware is some code you can put between the framework receiving 
a request, and the framework generating a response.
It provides a third-party extension point between dispatching an action, 
and the moment it reaches the reducer.
*/
/*
It is a middleware that looks at every action that passes through the system, and if it’s a function,
it calls that function. That’s all it does.
*/

// Actions are payloads of information that send data from your application to your store. 