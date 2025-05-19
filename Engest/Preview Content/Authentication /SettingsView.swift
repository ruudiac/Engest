import SwiftUI

@MainActor
final class SettingsViewModel: ObservableObject {
    @Published var email: String = ""
    @Published var showAlert = false
    @Published var alertMessage = ""

    init() {
        Task {
            await fetchUserEmail()
        }
    }

    func fetchUserEmail() async {
        do {
            let authUser = try AuthenticationManager.shared.getAuthenticatedUser()
            email = authUser.email ?? "No email"
        } catch {
            alertMessage = "Failed to fetch email: \(error.localizedDescription)"
            showAlert = true
        }
    }

    func signOut() throws {
        try AuthenticationManager.shared.signOut()
    }

    func resetPassword() async throws {
        let authUser = try AuthenticationManager.shared.getAuthenticatedUser()
        guard let email = authUser.email else {
            throw URLError(.fileDoesNotExist)
        }
        try await AuthenticationManager.shared.resetPassword(email: email)
    }

    func updateEmail() async throws {
        let email = "hello123@gmail.com"
        try await AuthenticationManager.shared.updateEmail(email: email)
    }

    func updatePassword() async throws {
        let password = "Hello123"
        try await AuthenticationManager.shared.updatePassword(password: password)
    }
}

struct SettingsView: View {
    @StateObject private var viewModel = SettingsViewModel()
    @Binding var showSignInView: Bool
    @State private var navigateToRoot = false
    
    let buttonTitles = [
        "Sign out",
        "Reset password",
        "Update password",
        "Update email"
    ]

    var body: some View {
        NavigationStack {
            mainContent
                .alert("Error", isPresented: $viewModel.showAlert) {
                    Button("OK", role: .cancel) { }
                } message: {
                    Text(viewModel.alertMessage)
                }
                .navigationBarBackButtonHidden(true)
                .fullScreenCover(isPresented: $navigateToRoot) {
                    AuthenticationView(showSignInView: $showSignInView)
                }
        }
    }
    
    private var mainContent: some View {
        ZStack {
            Color(hex: "CBAADE").ignoresSafeArea()
            
            VStack(spacing: 0) {
                header
                
                // Content
                ScrollView {
                    VStack(spacing: 30) {
                        Spacer().frame(height: 20)
                        
                        // Email display
                        Text(viewModel.email)
                            .font(.custom("Caprasimo-Regular", size: 16))
                            .foregroundColor(.white)
                            .padding(.bottom, 20)
                        
                        buttonsGrid
                        
                        Spacer()
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)
                }
                
                footer
            }
        }
    }
    
    private var header: some View {
        ZStack {
            Rectangle()
                .fill(Color(hex: "A978C5"))
                .frame(height: 170)
                .ignoresSafeArea(edges: .top)
            
            Text("Settings")
                .font(.custom("Caprasimo-Regular", size: 32))
                .padding(.bottom, 20)
                .foregroundColor(.white)
        }
    }
    
    private var buttonsGrid: some View {
        VStack(spacing: 20) {
            ForEach(0..<2) { row in
                HStack(spacing: 20) {
                    ForEach(0..<2) { column in
                        let index = row * 2 + column
                        if index < buttonTitles.count {
                            SettingsButton(title: buttonTitles[index]) {
                                handleButtonTap(index)
                            }
                        }
                    }
                }
            }
        }
    }
    
    private var footer: some View {
        HStack {
            Spacer()
        }
        .frame(height: 60)
        .background(Color(hex: "A978C5"))
        .ignoresSafeArea(edges: .bottom)
    }

    private func handleButtonTap(_ index: Int) {
        switch index {
        case 0:
            Task {
                do {
                    try viewModel.signOut()
                    navigateToRoot = true
                    showSignInView = true
                } catch {
                    viewModel.alertMessage = "Sign out failed: \(error.localizedDescription)"
                    viewModel.showAlert = true
                }
            }
        case 1:
            Task {
                do {
                    try await viewModel.resetPassword()
                    viewModel.alertMessage = "Password reset email sent"
                    viewModel.showAlert = true
                } catch {
                    viewModel.alertMessage = "Reset failed: \(error.localizedDescription)"
                    viewModel.showAlert = true
                }
            }
        case 2:
            Task {
                do {
                    try await viewModel.updatePassword()
                    viewModel.alertMessage = "Password updated successfully"
                    viewModel.showAlert = true
                } catch {
                    viewModel.alertMessage = "Update failed: \(error.localizedDescription)"
                    viewModel.showAlert = true
                }
            }
        case 3:
            Task {
                do {
                    try await viewModel.updateEmail()
                    viewModel.alertMessage = "Email updated successfully"
                    viewModel.showAlert = true
                } catch {
                    viewModel.alertMessage = "Update failed: \(error.localizedDescription)"
                    viewModel.showAlert = true
                }
            }
        default: break
        }
    }
}

#Preview {
    SettingsView(showSignInView: .constant(false))
}
