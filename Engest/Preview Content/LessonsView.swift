import SwiftUI

struct LessonsView: View {
    @AppStorage("basicWordsCompleted") private var basicWordsCompleted = false
    @AppStorage("greetinsCompleted") private var greetingsCompleted = false
    @AppStorage("numbersCompleted") private var numbersCompleted = false

    var body: some View {
        NavigationStack {
            ZStack {
                Color(hex: "CBAADE").ignoresSafeArea()

                VStack(spacing: 0) {
        
                    ZStack {
                        Rectangle()
                            .fill(Color(hex: "A978C5"))
                            .frame(height: 100)

                        HStack {
                            Spacer()
                            NavigationLink {
                                SettingsView(showSignInView: .constant(false))
                            } label: {
                                Image(systemName: "gearshape.fill")
                                    .font(.title2)
                                    .foregroundColor(.white)
                                    .padding(.trailing, 20)
                            }
                        }

                        Text("Lessons")
                            .font(.custom("Caprasimo-Regular", size: 32))
                            .foregroundColor(.white)
                    }

                    // Rings content
                    VStack(spacing: 40) {
                        LessonCircleButton(
                            title: "Basic Words",
                            isCompleted: basicWordsCompleted,
                            destination: FlashcardView()
                        )

                        HStack(spacing: 40) {
                            LessonCircleButton(
                                title: "Greetings",
                                isCompleted: greetingsCompleted,
                                destination: GreetingsView()
                            )
                            LessonCircleButton(
                                title: "Numbers",
                                isCompleted: numbersCompleted,
                                destination: NumbersView()
                            )
                        }
                    }
                    .padding(.top, 30)

                    Spacer()

                    
                    HStack {
                        Spacer()
                        // (You could add more items here in the future)
                    }
                    .frame(height: 60)
                    .frame(maxWidth: .infinity)
                    .background(Color(hex: "A978C5"))
                }
            }
        }
    }
}

struct LessonCircleButton<Destination: View>: View {
    let title: String
    let isCompleted: Bool
    let destination: Destination

    var body: some View {
        NavigationLink(destination: destination) {
            VStack(spacing: 10) {
                ZStack {
                    Circle()
                        .fill(Color.purple.opacity(0.8))
                        .frame(width: 100, height: 100)
                        .overlay(
                            Circle()
                                .stroke(Color(hex: "FBA9FD"), lineWidth: 4)
                        )
                        .shadow(color: .black.opacity(0.3), radius: 6, x: 2, y: 4)

                    if isCompleted {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(Color(hex: "A155CB"))
                            .font(.system(size: 32))
                    }
                }

                Text(title)
                    .font(.custom("Caprasimo-Regular", size: 14))
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .frame(width: 100)
            }
        }
    }
}


#Preview {
    LessonsView()
}
