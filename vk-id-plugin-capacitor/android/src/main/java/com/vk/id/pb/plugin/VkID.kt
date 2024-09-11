package com.vk.id.pb.plugin

import android.util.Log

class VkID {
    fun echo(value: String?): String? {
        if (value != null) {
            Log.i("Echo", value)
        }

        return value
    }
}
