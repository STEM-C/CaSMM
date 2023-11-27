
import '@sinonjs/text-encoding'
import 'react-native-get-random-values'
import '@ethersproject/shims'

// filename: App.tsx

// ... shims

import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, Button } from 'react-native'

// Import the agent from our earlier setup
import { agent } from './setup'
// import some data types:
import { IIdentifier } from '@veramo/core'

const App = () => {
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([])

  // Add the new identifier to state
  const createIdentifier = async () => {
    const _id = await agent.didManagerCreate({
      provider: 'did:ethr:goerli',
    })
    setIdentifiers((s) => s.concat([_id]))
  }

  // Check for existing identifers on load and set them to state
  useEffect(() => {
    const getIdentifiers = async () => {
      const _ids = await agent.didManagerFind()
      setIdentifiers(_ids)

      // Inspect the id object in your debug tool
      console.log('_ids:', _ids)
    }

    getIdentifiers()
  }, [])

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Identifiers</Text>
          <Button onPress={() => createIdentifier()} title={'Create Identifier'} />
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {identifiers && identifiers.length > 0 ? (
              identifiers.map((id: IIdentifier) => (
                <View key={id.did}>
                  <Text>{id.did}</Text>
                </View>
              ))
            ) : (
              <Text>No identifiers created yet</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default App