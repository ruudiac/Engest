//
//  AuthenticationView.swift
//  Engest
//
//  Created by Gertrud Roos on 05.05.2025.
//

import SwiftUI

struct AuthenticationView: View {
    var body: some View {
        NavigationStack{
        VStack{
            
            NavigationLink(destination:
                SecondView()) {
                
                Text ("Sign In With Email")
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
        .navigationTitle("Sign In")
        }
    }
}

#Preview {
    AuthenticationView()
}
