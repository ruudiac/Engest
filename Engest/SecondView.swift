//
//  SecondView.swift
//  Engest
//
//  Created by Gertrud Roos on 30.03.2025.
// Log In

import SwiftUI

final class SignInEmailViewModel: ObservableObject {
    
    @Published var email = ""
    @Published var password = ""
    
}

struct SecondView: View {
    
    @StateObject private var viewModel = SignInEmailViewModel()
    
    
    var body: some View {
        NavigationStack {
            
            VStack {
                
                
                TextField("Email:", text: $viewModel.email)
                    .textFieldStyle(.roundedBorder)
                    .padding()
                    .frame(width: 250)
                    .cornerRadius(40)
                
                SecureField("Password:", text: $viewModel.password)
                    .textFieldStyle(.roundedBorder)
                    .padding()
                    .frame(width: 250)
                    .cornerRadius(40)
                
                Button{
                    
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
