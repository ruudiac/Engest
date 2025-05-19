import SwiftUI
import FirebaseAuth

@MainActor
final class SignInEmailViewModel: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    
    func signUp() async throws {
        guard !email.isEmpty, !password.isEmpty else {
            print("No email or password found.")
            return
        }
        try await AuthenticationManager.shared.createUser(email: email, password: password)
    }
    
    func signIn() async throws {
        guard !email.isEmpty, !password.isEmpty else {
            print("No email or password found.")
            return
        }
        try await AuthenticationManager.shared.signInUser(email: email, password: password)
    }
}

struct SignInEmailView: View {
    @StateObject private var viewModel = SignInEmailViewModel()
    @Binding var showSignInView: Bool
    
    var body: some View {
        ZStack {
            Color(hex: "CBAADE") // Updated background color
                .ignoresSafeArea()
            
            VStack {
                Spacer()
                
                VStack(alignment: .leading, spacing: 16) {
                    Text("Sign up")
                        .font(.custom("Caprasimo", size: 32))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity, alignment: .center)
                    
                    Group {
                        Text("Email:")
                            .font(.custom("Caprasimo", size: 16))
                            .foregroundColor(.white)
                        
                        TextField("Enter your email...", text: $viewModel.email) // Added placeholder
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                            .padding()
                            .background(Color.white)
                            .cornerRadius(20)
                            .overlay(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(Color.black, lineWidth: 1) // Added black stroke
                            )
                            .foregroundColor(Color(hex: "000000")) // Text color black
                    }
                    
                    Group {
                        Text("Password:")
                            .font(.custom("Caprasimo", size: 16))
                            .foregroundColor(.white)
                        
                        SecureField("Enter your password...", text: $viewModel.password) // Added placeholder
                            .padding()
                            .background(Color.white)
                            .cornerRadius(20)
                            .overlay(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(Color.black, lineWidth: 1) // Added black stroke
                            )
                            .foregroundColor(Color(hex: "000000")) // Text color black
                    }
                    
                    Button {
                        Task {
                            do {
                                try await viewModel.signUp()
                                showSignInView = false
                            } catch let error as NSError {
                                if error.code == AuthErrorCode.emailAlreadyInUse.rawValue {
                                    do {
                                        try await viewModel.signIn()
                                        showSignInView = false
                                    } catch {
                                        print("Sign-in failed: \(error.localizedDescription)")
                                    }
                                } else {
                                    print("Sign-up failed: \(error.localizedDescription)")
                                }
                            }
                        }
                    } label: {
                        Text("Sign In / Sign Up")
                            .font(.custom("Caprasimo", size: 18))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color(hex: "A155CB"))
                            .cornerRadius(30)
                    }
                    .padding(.top, 12)
                }
                .padding(32)
                .frame(width: 366, height: 597)
                .background(Color(hex: "C68EE5"))
                .cornerRadius(40)
                .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 5)
                
                Spacer()
            }
        }
    }
}

#Preview {
    NavigationStack {
        SignInEmailView(showSignInView: .constant(false))
    }
}
