//
//  Engest.swift
//  Engest
//
//  Created by Gertrud Roos on 11.05.2025.
//

import SwiftUI
import Firebase

@main
struct Engest: App {
    
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    
    var body: some Scene{
        WindowGroup{
            RootView()
        }
    }
}

class AppDelegate: NSObject, UIApplicationDelegate{
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        FirebaseApp.configure()
        
        return true
    }
}
