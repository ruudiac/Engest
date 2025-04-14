//
//  FirstView.swift
//  Engest
//
//  Created by Gertrud Roos on 30.03.2025.
// Sign up

import SwiftUI

struct FirstView: View {
    @State private var textInput = ""
    @State private var textinput = ""
    var body: some View {
        
            VStack {
                Text("Sign Up")
                    .font(.largeTitle)
                    .padding(.bottom,20)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                TextField("Email", text:$textInput)
                    .textFieldStyle(.roundedBorder)
                    .padding()
                    .frame(width: 250)
                
                TextField("Password", text:$textinput)
                    .textFieldStyle(.roundedBorder)
                    .padding()
                    .frame(width: 250)
                
                NavigationLink(destination: Dashboard()) {
                    Text("Sign up")
                        .padding()
                        .frame(width:150, height: 50)
                        .background(Color(red: 161/255, green: 85/255, blue: 203/255))
                        .foregroundColor(.white)
                        .cornerRadius(40)
                }
        
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color(red: 0.796, green: 0.667, blue: 0.871))
            .ignoresSafeArea()
        }
    }


#Preview {
    FirstView()
}
