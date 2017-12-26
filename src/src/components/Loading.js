import React from 'react'

/**
 * @return {null}
 */
const LoadingComponent = ({isLoading, error, pastDelay}) => {
  if (isLoading) {
    return pastDelay ? <div>Loading...</div> : null // Don't flash "Loading..." when we don't need to.
  } else if (error) {
    return <div>Error! Component failed to load</div>
  } else {
    return null
  }
}
export default LoadingComponent
