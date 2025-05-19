import SwiftUI

struct AuthenticationView: View {
    @Binding var showSignInView: Bool
    @State private var path = NavigationPath()
    
    var body: some View {
        NavigationStack(path: $path) {
            ZStack {
                Color(hex: "CBAADE")
                    .ignoresSafeArea()
                
                VStack {
                    Spacer()
                    
                    VStack(spacing: 0) {
                        // Logo
                        VStack(spacing: 4) {
                            Text("Engest")
                                .font(.custom("Caprasimo", size: 36))
                                .foregroundColor(.white)
                                .padding(.bottom, 4)
                            
                            Text("Just learn.")
                                .font(.custom("Caprasimo", size: 16))
                                .foregroundColor(.white.opacity(0.9))
                        }
                        .padding(.top, 32)
                        
                        Spacer().frame(height: 60)
                        
                        // Sign In / Sign Up Button
                        Button {
                            path.append("signin")
                        } label: {
                            Text("Sign Up / Sign In")
                                .font(.custom("Caprasimo", size: 20))
                                .foregroundColor(.white)
                                .padding()
                                .frame(maxWidth: 250)
                                .background(Color(hex: "A155CB"))
                                .cornerRadius(40)
                                .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 5)
                        }
                        .padding(.bottom, 32)
                    }
                    .frame(width: 366, height: 597)
                    .background(Color(hex: "C68EE5"))
                    .cornerRadius(40)
                    .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 5)
                    
                    Spacer()
                }
            }
            .navigationDestination(for: String.self) { value in
                if value == "signin" {
                    SignInEmailView(showSignInView: $showSignInView)
                }
            }
        }
    }
}

#Preview {
    AuthenticationView(showSignInView: .constant(true))
}
