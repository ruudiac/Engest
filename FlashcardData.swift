//
//  FlashcardData.swift
//  Engest
//
//  Created by Gertrud Roos on 12.05.2025.
//

import Foundation

struct Flashcard: Identifiable {
    let id = UUID()
    let word: String
    let translation: String
}

enum FlashcardDecks {
    static let basicPhrases = [
        Flashcard(word: "Tere", translation: "Hello"),
        Flashcard(word: "Aitäh", translation: "Thank you"),
        Flashcard(word: "Aitäh", translation: "Thank you"),
        
    ]
}
