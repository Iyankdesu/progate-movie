import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { API_ACCESS_TOKEN } from '@env'

const CategorySearchResult = (): JSX.Element => {
  const route = useRoute()
  const navigation = useNavigation()
  const { genreId } = route.params as { genreId: number }
  const [movies, setMovies] = useState<any[]>([])

  useEffect(() => {
    fetchMoviesByGenre()
  }, [])

  const fetchMoviesByGenre = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      setMovies(data.results)
    } catch (error) {
      console.log(error)
    }
  }

  const renderMovieItem = ({ item }: { item: any }): JSX.Element => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
    >
      <ImageBackground
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.cardImage}
      >
        <View style={styles.cardOverlay}>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.resultsContainer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  resultsContainer: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 4,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
})

export default CategorySearchResult
