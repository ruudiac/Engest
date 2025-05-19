import SwiftUI

struct PractiseView: View {
    let flashcards: [(String, String)]
    
    @State private var currentIndex = 0
    @State private var score = 0
    @State private var showingFeedback = false
    @State private var feedbackMessage = ""
    @State private var feedbackColor: Color = .clear
    @State private var options: [String] = []
    @State private var correctAnswer = ""
    @State private var navigateToLessons = false
    @State private var shuffledFlashcards: [(String, String)] = []
    @AppStorage("basicWordsCompleted") private var basicWordsCompleted = false
    @AppStorage("greetinsCompleted") private var greetingsCompleted = false
    @AppStorage("numbersCompleted") private var
        numbersCompleted = false
    @State private var isLoading = true
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Practise")
                .font(.largeTitle)
                .bold()
                .padding(.top, 20)
            
            if isLoading {
                ProgressView()
                    .padding()
            } else if shuffledFlashcards.isEmpty {
                Text("No flashcards available")
                    .font(.title)
                    .foregroundColor(.gray)
                    .padding()
            } else {
                Text("Score: \(score)/\(currentIndex)")
                    .font(.title2)
                
                Spacer()
                
                Text(shuffledFlashcards[currentIndex].0)
                    .font(.system(size: 48, weight: .bold))
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(10)
                    .padding(.horizontal, 20)
                
                Text("What is the correct translation?")
                    .font(.headline)
                
                VStack(spacing: 15) {
                    ForEach(options, id: \.self) { option in
                        Button(action: {
                            checkAnswer(selected: option)
                        }) {
                            Text(option)
                                .font(.system(size: 20))
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.blue.opacity(0.1))
                                .cornerRadius(10)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(Color.blue, lineWidth: 1)
                                )
                        }
                        .disabled(showingFeedback)
                    }
                }
                .padding(.horizontal, 20)
                
                if showingFeedback {
                    Text(feedbackMessage)
                        .font(.headline)
                        .foregroundColor(feedbackColor)
                        .padding()
                        .transition(.opacity)
                    
                    Button(action: {
                        if currentIndex < shuffledFlashcards.count - 1 {
                            nextQuestion()
                        } else {
                            completeLesson()
                            navigateToLessons = true
                        }
                    }) {
                        Text(currentIndex < shuffledFlashcards.count - 1 ? "Next Question" : "Finish Quiz")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }
                    .padding(.horizontal, 20)
                }
            }
            
            Spacer()
            
            NavigationLink(destination: LessonsView(), isActive: $navigateToLessons) {
                EmptyView()
            }
        }
        .onAppear {
            setupFlashcards()
        }
    }
    
    private func setupFlashcards() {
        guard !flashcards.isEmpty else {
            isLoading = false
            return
        }
        
        shuffledFlashcards = flashcards.shuffled()
        generateOptions()
        isLoading = false
    }
    
    private func generateOptions() {
        guard !shuffledFlashcards.isEmpty else { return }
        
        correctAnswer = shuffledFlashcards[currentIndex].1
        
        var wrongOptions = shuffledFlashcards.map { $0.1 }.filter { $0 != correctAnswer }
        wrongOptions.shuffle()
        let selectedWrongOptions = Array(wrongOptions.prefix(min(2, wrongOptions.count)))
        
        options = (selectedWrongOptions + [correctAnswer]).shuffled()
    }
    
    private func checkAnswer(selected: String) {
        showingFeedback = true
        if selected == correctAnswer {
            score += 1
            feedbackMessage = "Correct! 🎉"
            feedbackColor = .green
        } else {
            feedbackMessage = "Incorrect. The correct answer is: \(correctAnswer)"
            feedbackColor = .red
        }
    }
    
    private func nextQuestion() {
        guard !shuffledFlashcards.isEmpty else { return }
        
        if currentIndex < shuffledFlashcards.count - 1 {
            currentIndex += 1
            showingFeedback = false
            generateOptions()
        }
    }
    
    private func completeLesson() {
        // Determine which lesson was completed based on the flashcards
        if flashcards.contains(where: { $0.0 == "Üks" }) { // Numbers lesson
            numbersCompleted = true
        } else if flashcards.contains(where: { $0.0 == "Tere" }) { // Greetings lesson
            greetingsCompleted = true
        } else { // Basic words lesson
            basicWordsCompleted = true
        }
    }
}

#Preview {
    NavigationStack {
        PractiseView(flashcards: [
            ("Tere", "Hello"),
            ("Aitäh", "Thank you"),
            ("Palun", "Please")
        ])
    }
}
