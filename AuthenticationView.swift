//
//  AuthenticationView.swift
//  Engest
//
//  Created by Gertrud Roos on 05.05.2025.
//

import SwiftUI

struct AuthenticationView: View {
    
    @Binding var showSignInView: Bool
    var body: some View {
        VStack{

            NavigationLink {
                SignInEmailView(showSignInView: $showSignInView)
                   
            } label: {
                Text ("Sign Up With Email")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .foregroundColor(.white)
                    .background(Color.blue)

                    .cornerRadius(10)
            }
            Spacer()
            
            }
        .padding()
        .navigationTitle("Sign Up")

    }
}

#Preview {
    NavigationStack{
        AuthenticationView(showSignInView: .constant(false))
    }

}
