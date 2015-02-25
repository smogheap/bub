LOAD({
	"name": "restart",
	"scale": 2,
	"above": [
		{
			"tag": "active",
			"name": "mask",
			"image": "image/scribble/restart-indicator.png",
			"pivot": {
				"x": 97,
				"y": 95
			},
			"rotate": 8,
			"scale": 1,
			"alpha": 1,
			"offset": {
				"x": 0,
				"y": 0
			},
			"below": [
				{
					"name": "half",
					"image": "image/scribble/restart-half.png",
					"pivot": {
						"x": 79,
						"y": 79
					},
					"rotate": -8,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 97,
						"y": 95
					},
					"above": [
						{
							"tag": "white",
							"name": "white",
							"image": "image/scribble/restart-white.png",
							"pivot": {
								"x": 79,
								"y": 79
							},
							"rotate": 175,
							"scale": 1,
							"alpha": 1,
							"offset": {
								"x": 79,
								"y": 79
							}
						},
						{
							"tag": "red",
							"name": "red",
							"image": "image/scribble/restart-red.png",
							"pivot": {
								"x": 79,
								"y": 79
							},
							"rotate": -5,
							"scale": 1,
							"alpha": 1,
							"offset": {
								"x": 79,
								"y": 79
							}
						}
					]
				}
			]
		}
	]
});
