# Tests

> Full stack test suite

<br/>

## Setup

1. Install dependencies `yarn`

2. Run the service `yarn start` 

   > Make sure to delete the db container to make sure it rebuilds for testing

<br/>

## Testing

### Functional 

- Framework – Jest
- Usage – Test UI w/ snapshots and mocking
- Run  `yarn functional`

### Integration

- Framework – Jest
- Usage – Test all the API endpoints for roles, data access, and function
- Run `yarn integration`

### Performance

- Framework – K6
- Usage – Stress and Load test the application
- Run yarn `performance`



