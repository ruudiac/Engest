//
//  ContentView.swift
//  Engest
//
//  Created by Gertrud Roos on 29.03.2025.
//

import SwiftUI
import Firebase

struct ContentView: View {
    
    init() {
        FirebaseApp.configure()
        print("Configured Firebase")
    }
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Engest.")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text("Just learn.")
                    .foregroundColor(.white)
                    .padding(.bottom, 20)
                
                NavigationLink(destination: FirstView()) {
                    Text("Sign up")
                        .padding()
                        .frame(width:150, height: 50)
                        .background(Color(red: 161/255, green: 85/255, blue: 203/255))
                        .foregroundColor(.white)
                        .cornerRadius(40)
                }
                
                NavigationLink(destination: SecondView()) {
                    Text("Log in")
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
}
        
        #Preview {
            ContentView()
        }
