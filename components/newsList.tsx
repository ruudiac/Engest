import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { getNews, NewsItem } from '../lib/errNews';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);


  useFocusEffect(
    useCallback(() => {
      setFailed(false);
      getNews(5).then(setNews).catch(() => setFailed(true));
    }, []),
  );

  if (failed) {
    return (
      <View className="bg-white rounded-3xl border border-[#EBD5F7] px-4 py-6 items-center">
        <Text className="font-inter text-sm text-[#875BA1]">Couldn't load the news. Check your internet.</Text>
      </View>
    );
  }

  if (!news) {
    return (
      <View className="bg-white rounded-3xl border border-[#EBD5F7] py-8 items-center">
        <ActivityIndicator color="#7F39A6" />
      </View>
    );
  }

  return (
    <View className="bg-white rounded-3xl border border-[#EBD5F7] overflow-hidden">
      {news.map((n, i) => (
        <Pressable
          key={n.link}
          onPress={() => WebBrowser.openBrowserAsync(n.link)}
          className={`flex-row gap-3 px-4 py-3 ${i > 0 ? 'border-t border-[#F3E6FA]' : ''}`}
        >
          {n.image && (
            <Image source={{ uri: n.image }} style={{ width: 56, height: 56, borderRadius: 12 }} />
          )}
          <View className="flex-1">
            <Text className="font-inter font-bold text-sm text-[#543666]" numberOfLines={3}>{n.title}</Text>
            <Text className="font-inter text-xs text-[#B48FCB] mt-1">{n.date} · ERR News</Text>
          </View>
        </Pressable>
      ))}

      <Pressable
        onPress={() => WebBrowser.openBrowserAsync('https://news.err.ee')}
        className="flex-row items-center justify-center gap-1 py-3 border-t border-[#F3E6FA]"
      >
        <Text className="font-inter font-semibold text-sm text-[#7F39A6]">More on ERR News</Text>
        <Ionicons name="chevron-forward" size={14} color="#7F39A6" />
      </Pressable>
    </View>
  );
}