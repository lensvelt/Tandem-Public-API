var redis = require('redis');

//use default host & port for now
var client = redis.createClient();
const REQUEST_LIMIT_PER_SEC = 1;
const REQUEST_LIMIT_PER_MIN = 20;

//Handle errors
client.on('error', (err) => {
  console.log('Error: ', err, '\n', err.stack);
});

client.on('ready', () => {
  console.log('Connected to Redis client...');
})

//Rate Limiting middleware function for api
var rateLimiter = () => {

  //Return the throttling middleware function, retaining access via closure to the sorted rate limits
  //Leaky bucket implementation
  return (req, res, next) => {
    const nameSpace = 'apireq:';
    //Limit API calls per user (vs per user per endpoint) - use user id if authenticated, else best guess ip address (anonymous user)
    var userKey = nameSpace + (req.user.id || req.ip || req.ips);
    client.get(userKey, (error, replies) => {
      if (error) {
        console.log(error);
        next(err);
      } else if (!replies) {
        //No previous requests; no need to throttle - process API request
        next();
      } else {
        if (replies.length)
      }
    });

        //For each request added to Redis List (linked list), set TTL = maximum time constraint, value = current time stamp
        //[front of list = oldest, back of list = newest]
        //No of elements = total no of requests for the specified TTL interval
        //


        // FUNCTION LIMIT_API_CALL(ip)
        // ts = CURRENT_UNIX_TIME()
        // keyname = ip+":"+ts
        // current = GET(keyname)
        // IF current != NULL AND current > 10 THEN
        //     ERROR "too many requests per second"
        // ELSE
        //     MULTI
        //         INCR(keyname,1)
        //         EXPIRE(keyname,10)
        //     EXEC
        //     PERFORM_API_CALL()
        // END

      // });      
  }
};




//PSEUDOCODE - EXPRESS MIDDLEWARE THROTTLE FUNCTION:
//for each user
  //for each new api request
    //check the elapsed since most recent request
    //iterate over the established rate constraints per smallest unit of time to largest
      //if still inside current time constraint, block the request & respond with 429 status, updating headers
      //else check time elapsed since next most recent request
        //if still inside next largest time constraint, block the request & respond with 429 status, updating headers
        //else
          //set the TTL time to live equal to the time period for the current constraint
          //increment Redis timestamped request count by one accordingly
          //process the api request
//
//
//Redis Data Structure:
//A list of requests per each user
//key for each user:
  //loggedInUser? -> namespace + user_id per decoded token + route
  //anonymousUser? -> namespace + ip + route
//value = timestamp
//list (array) length - dictated by rate constraint for largest user of time, expressed in seconds


// //Redis example
// var client = redis.createClient(), set_size = 20;
 
// client.sadd("bigset", "a member");
// client.sadd("bigset", "another member");
 
// while (set_size > 0) {
//     client.sadd("bigset", "member " + set_size);
//     set_size -= 1;
// }
 
// // multi chain with an individual callback 
// client.multi()
//     .scard("bigset")
//     .smembers("bigset")
//     .keys("*", function (err, replies) {
//         // NOTE: code in this callback is NOT atomic 
//         // this only happens after the the .exec call finishes. 
//         client.mget(replies, redis.print);
//     })
//     .dbsize()
//     .exec(function (err, replies) {
//       console.log(replies);
//         console.log("MULTI got " + replies.length + " replies");
//         replies.forEach(function (reply, index) {
//             console.log("Reply " + index + ": " + reply.toString());
//         });
//     });