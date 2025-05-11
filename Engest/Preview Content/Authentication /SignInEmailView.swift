//
//  SignInEmailView.swift
//  Engest
//
//  Created by Gertrud Roos on 11.05.2025.
//

import SwiftUI

@MainActor
final class SignInEmailViewModel: ObservableObject {
    
    @Published var email = ""
    @Published var password = ""
    
    func signIn() async throws{
        guard !email.isEmpty, !password.isEmpty else{
            print("No email or password found.")
            return
        }

        try await AuthenticationManager.shared.createUser(email: email, password: password)
        
    }
}


struct SignInEmailView: View {
    
    @StateObject private var viewModel = SignInEmailViewModel()
    @Binding var showSignInView: Bool
    
    var body: some View {
        VStack{
            TextField("Email...", text: $viewModel.email)
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(10)
            SecureField("Password...", text: $viewModel.password)
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(10)
            
            Button {
                Task{
                    do{
                        try await viewModel.signIn()
                        showSignInView = false
                    } catch{
                        
                    }
                }
            } label: {
                Text ("Sign In")
                .font(.headline)
                .frame(maxWidth: .infinity)
                .foregroundColor(.white)
                .cornerRadius(40)
            }
            
            Spacer()
            
        }
        .padding()
        .navigationTitle("Sign In With Email")
    }
}

#Preview {
    SignInEmailView(showSignInView: .constant(false))
}
