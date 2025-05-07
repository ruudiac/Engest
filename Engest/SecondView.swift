//
//  SecondView.swift
//  Engest
//
//  Created by Gertrud Roos on 30.03.2025.
// Log In

import SwiftUI

@MainActor
final class SignInEmailViewModel: ObservableObject {
    
    @Published var email = ""
    @Published var password = ""
    
    func signIn(){
        guard !email.isEmpty, !password.isEmpty else {
            print("No email or password found!")
            return
        }
        
        Task {
            do {
                let returnedUserData = try await AuthenticationManager.shared.createUser(email: email, password: password)
                print("Success")
                print(returnedUserData)
            } catch {
                print("Error: \(error)")
            }
        }
    }
}

struct SecondView: View {
    
    @StateObject private var viewModel = SignInEmailViewModel()
    
    
    var body: some View {
        NavigationStack {
            
            VStack {
                
                
                TextField("Email:", text: $viewModel.email)
                    .padding()
                    .background(Color(red: 161/255, green: 85/255, blue: 203/255).opacity(0.1))
                    .cornerRadius(40)
                
                SecureField("Password:", text: $viewModel.password)
                    .padding()
                    .background(Color(red: 161/255, green: 85/255, blue: 203/255).opacity(0.1))
                    .cornerRadius(40)
                
                Button{
                    viewModel.signIn()
                } label: {
                    Text("Sign In")
                        .padding()
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .background(Color(red: 161/255, green: 85/255, blue: 203/255))
                        .foregroundColor(.white)
                        .cornerRadius(40)
                }
                Spacer()
            }
            .padding()
            .navigationTitle("Sign In with Email")
        }
    }
}

#Preview {
    SecondView()
}
