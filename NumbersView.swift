import SwiftUI

struct NumbersView: View {
    let flashcards = [
        ("Üks", "One"),
        ("Kaks", "Two"),
        ("Kolm", "Three"),
        ("Neli", "Four"),
        ("Viis", "Five"),
        ("Kuus", "Six"),
        ("Seitse", "Seven"),
        ("Kaheksa", "Eight"),
        ("Üheksa", "Nine"),
        ("Kümme", "Ten")
    ]

    @State private var currentIndex = 0
    @State private var rotationAngle: Double = 0
    @State private var navigateToPractise = false
    @State private var flippedIndices: Set<Int> = []
    
    var allCardsFlipped: Bool {
        return flippedIndices.count == flashcards.count
    }
    
    var body: some View {
        VStack {
            Text("\(currentIndex + 1)/\(flashcards.count)")
                .font(.headline)
                .padding(.top, 20)
            
            ZStack {
                if rotationAngle >= 90 {
                    CardFace(text: flashcards[currentIndex].1, color: .blue, textColor: .white)
                        .rotation3DEffect(.degrees(180), axis: (x: 0, y: 1, z: 0))
                }
                
                if rotationAngle < 90 {
                    CardFace(text: flashcards[currentIndex].0, color: .white, textColor: .black)
                        .opacity(rotationAngle < 90 ? 1 : 0)
                }
            }
            .rotation3DEffect(
                .degrees(rotationAngle),
                axis: (x: 0, y: 1, z: 0),
                perspective: 0.5
            )
            .onTapGesture {
                flipCard()
            }
            .padding(.vertical, 40)
            
            HStack(spacing: 20) {
                Button(action: previousCard) {
                    HStack {
                        Image(systemName: "arrow.left")
                        Text("Previous")
                    }
                    .frame(width: 120, height: 44)
                    .background(currentIndex > 0 ? Color.blue : Color.gray)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                }
                .disabled(currentIndex <= 0)
                
                Button(action: nextCard) {
                    HStack {
                        Text("Next")
                        Image(systemName: "arrow.right")
                    }
                    .frame(width: 120, height: 44)
                    .background(currentIndex < flashcards.count - 1 ? Color.blue : Color.gray)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                }
                .disabled(currentIndex >= flashcards.count - 1)
            }
            
            if allCardsFlipped {
                Button("Start Practise") {
                    navigateToPractise = true
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(10)
                .padding(.top, 20)
                .padding(.horizontal)
            }

            Spacer()
        }
        .padding()
        .navigationDestination(isPresented: $navigateToPractise) {
            PractiseView(flashcards: flashcards)
        }
    }
    
    private func flipCard() {
        withAnimation(.easeInOut(duration: 0.3)) {
            rotationAngle = rotationAngle == 0 ? 180 : 0
        }
        flippedIndices.insert(currentIndex)
    }
    
    private func nextCard() {
        if currentIndex < flashcards.count - 1 {
            currentIndex += 1
            resetCard()
        }
    }
    
    private func previousCard() {
        if currentIndex > 0 {
            currentIndex -= 1
            resetCard()
        }
    }
    
    private func resetCard() {
        withAnimation {
            rotationAngle = 0
        }
    }
}

#Preview {
    NumbersView()
}
