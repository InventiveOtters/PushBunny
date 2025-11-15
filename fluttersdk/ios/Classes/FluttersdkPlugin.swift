import Flutter
import UIKit
import library

public class FluttersdkPlugin: NSObject, FlutterPlugin, PushBunnyApi {
  public static func register(with registrar: FlutterPluginRegistrar) {
    let instance = FluttersdkPlugin()
    PushBunnyApiSetup.setUp(binaryMessenger: registrar.messenger(), api: instance)
  }

  public func generateNotification(
    request: NotificationRequest,
    completion: @escaping (Result<NotificationResponse, Error>) -> Void
  ) {
    Task {
      do {
        let response = try await NotificationApiKt.generateNotificationBody(
          baseMessage: request.baseMessage,
          context: request.context,
          apiKey: request.apiKey,
          intentId: request.intentId,
          locale: request.locale
        )

        let pigeonResponse = NotificationResponse(
          variantId: response.variantId,
          resolvedMessage: response.resolvedMessage
        )

        completion(.success(pigeonResponse))
      } catch {
        let pigeonError = PigeonError(
          code: "NOTIFICATION_ERROR",
          message: error.localizedDescription,
          details: "\(error)"
        )
        completion(.failure(pigeonError))
      }
    }
  }
}
